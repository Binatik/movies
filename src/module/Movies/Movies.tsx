import { Alert, Flex, Input, Tabs } from "antd";
import { Pagination, SpinOutlined } from "../../ui";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Card } from "./Card";
import { MoviesService } from "../../api/MoviesService";
import Cookies from "js-cookie";
import { IMoviesFilter } from "./Movies.types";
import { IFetchError, IServerError } from "../../api/api.types";
import { getElementsPagination } from "../../helpers/getElementsPagination";
import debounce from "lodash.debounce";

const api = new MoviesService();
const templateMovies: IMoviesFilter = {
  loading: true,
  data: null,
  payload: null,

  error: {
    message: "FetchError",
    status: false,
    payload: null,
  },
};

let pageServer = 1;

const cachePages = new Map<number, number>();
const counterCurrentPage = 5; //Кол - во элементов на одну стр.

const rootHeaders = {
  Authorization: api.getToken,
  accept: "application/json",
};

function Movies() {
  const [errorApi, setErrorApi] = useState<IMoviesFilter["error"]>({
    message: "FetchError",
    status: false,
    payload: null,
  }); //Для обработки если проблемы с сетью, должен быть глобален.

  const [popularMovies, setPopularMovies] = useState(templateMovies);
  const [currentNumberPagePagination, setCurrentNumberPagePagination] =
    useState(1);

  function checkApi<T>(error: T, callback?: (error: IServerError) => void) {
    //callback во сновном для состояний компонетов, например ErrorResponse.

    const typeErrorApi = error as IFetchError;
    const typeErrorSerever = error as IServerError;

    if (api.isApiError(typeErrorApi)) {
      setErrorApi(typeErrorApi);
    } else if (api.isApiResponse(typeErrorSerever)) {
      if (!callback) return;
      callback(typeErrorSerever);
    }
  }

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session =
          !api.getSession && (await api.getCreateGuestSession(rootHeaders));
        session &&
          Cookies.set("guest_session_id", session.guest_session_id, {
            expires: 1,
          });
      } catch (error) {
        checkApi(error);
      }
    };

    const fetchMovies = async () => {
      try {
        const result = await api.getPopularMovie("ru-US", 1, rootHeaders);
        setPopularMovies((prev) => ({ ...prev, data: result, loading: false }));
      } catch (error) {
        checkApi(error, (error) => {
          setPopularMovies((prev) => ({
            ...prev,
            error: error,
            loading: false,
          }));
        });
      }
    };
    fetchSession();
    fetchMovies();
  }, []);

  //Получаем элементы нужной стр.
  const elementsCurrentPage = useMemo(() => {
    const data = popularMovies.data;
    if (!data) return;

    return getElementsPagination(
      data.results,
      currentNumberPagePagination,
      counterCurrentPage,
    );
  }, [popularMovies, currentNumberPagePagination]);

  async function updateMovies(page: number) {
    setCurrentNumberPagePagination(page);

    if (page % 4 !== 0) {
      return;
    }

    try {
      if (!cachePages.has(pageServer)) {
        setPopularMovies((prev) => ({ ...prev, loading: true }));
        const result = await api.getPopularMovie(
          "ru-US",
          pageServer,
          rootHeaders,
        );

        cachePages.set(pageServer, pageServer);
        pageServer += 1;

        setPopularMovies((prev) => {
          return {
            ...prev,
            loading: false,
            data: {
              results: prev.data?.results.concat(result.results),
            },
          } as IMoviesFilter;
        });
      }
    } catch (error) {
      checkApi(error);
    }
  }

  async function getSearchMovies(event: ChangeEvent<HTMLInputElement>) {
    const inputValue = event.currentTarget.value;

    try {
      if (inputValue !== " ") {
        setPopularMovies((prev) => ({ ...prev, loading: true }));
        const result = await api.getSearchMovies(
          inputValue,
          true,
          "ru-US",
          1,
          rootHeaders,
        );
        setPopularMovies((prev) => ({ ...prev, data: result, loading: false }));
      }

      if (inputValue === "") {
        setPopularMovies((prev) => ({ ...prev, loading: true }));
        const result = await api.getPopularMovie("ru-US", 1, rootHeaders);
        setPopularMovies((prev) => ({ ...prev, data: result, loading: false }));
      }
    } catch (error) {
      checkApi(error, (error) => {
        setPopularMovies((prev) => ({ ...prev, error: error, loading: false }));
      });
    }
  }

  return (
    //Warning: [antd: Tabs] `Tabs.TabPane` is deprecated.
    <Tabs
      tabBarStyle={{ width: "140px", margin: "0 auto 19px auto" }}
      size="large"
      centered
    >
      <Tabs.TabPane tab="Search" key="item-1">
        {errorApi.status && (
          <Alert
            style={{ marginBottom: 10 }}
            message={errorApi.message}
            description={`${errorApi.payload}`}
            type="warning"
            showIcon
            closable
          />
        )}
        <Input
          onChange={debounce(getSearchMovies, 350)}
          size="large"
          placeholder="Type to search..."
        />
        <Flex gap="middle" justify="center" wrap="wrap">
          {popularMovies.error.status ? (
            <h1>Ошибка загрузки {popularMovies.error.payload}</h1>
          ) : (
            <SpinOutlined
              isLoading={popularMovies.loading}
              isErrorApi={errorApi.status}
            >
              {elementsCurrentPage?.map((movie) => (
                <Card key={movie.id} movie={movie} />
              ))}
            </SpinOutlined>
          )}
        </Flex>
        <br />
        <br />
        <Flex gap="middle" justify="center">
          {elementsCurrentPage && elementsCurrentPage.length > 0 && (
            <Pagination
              onChange={updateMovies}
              type="primary"
              defaultPageSize={counterCurrentPage}
              className="movie__pagination"
              total={popularMovies.data?.results.length}
            />
          )}
        </Flex>
        <br />
        <br />
      </Tabs.TabPane>
      <Tabs.TabPane tab="Rated" key="item-2">
        Content
      </Tabs.TabPane>
    </Tabs>
  );
}

export { Movies };
