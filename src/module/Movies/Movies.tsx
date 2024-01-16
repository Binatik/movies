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
  data: null,
  payload: null,

  error: {
    message: null,
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

  const [isLoading, setIsLoading] = useState(true); //Отвечает за состояние загрузки popularMovies
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
        setPopularMovies((prev) => ({ ...prev, data: result }));
      } catch (error) {
        checkApi(error, (error) => {
          setPopularMovies((prev) => ({
            ...prev,
            error,
          }));
        });
      } finally {
        setIsLoading(false);
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
      if (cachePages.has(page)) {
        return;
      }

      pageServer += 1;
      setIsLoading(true);
      const result = await api.getPopularMovie(
        "ru-US",
        pageServer,
        rootHeaders,
      );

      setPopularMovies((prev) => {
        return {
          ...prev,
          data: {
            results: prev.data?.results.concat(result.results),
          },
        } as IMoviesFilter;
      });

      cachePages.set(page, pageServer);
    } catch (error) {
      checkApi(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function getSearchMovies(event: ChangeEvent<HTMLInputElement>) {
    const inputValue = event.currentTarget.value;
    cachePages.clear();

    setCurrentNumberPagePagination(1);
    setIsLoading(true);

    try {
      if (inputValue.trim() === "") {
        const result = await api.getPopularMovie("ru-US", 1, rootHeaders);
        setPopularMovies((prev) => ({ ...prev, data: result }));
        return;
      }

      const result = await api.getSearchMovies(
        inputValue,
        true,
        "ru-US",
        1,
        rootHeaders,
      );
      setPopularMovies((prev) => ({
        ...prev,
        payload: inputValue,
        data: result,
      }));
    } catch (error) {
      checkApi(error, (error) => {
        setPopularMovies((prev) => ({ ...prev, error }));
      });
    } finally {
      setIsLoading(false);
    }
  }

  //Тут не совсем понимаю как с unknown работать в jsx, кроме как надоумить создать функцию идей нет!
  function getMoviesPayload() {
    if (typeof popularMovies.payload === "string") {
      return popularMovies.payload;
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
            <SpinOutlined isLoading={isLoading} isErrorApi={errorApi.status}>
              {elementsCurrentPage && elementsCurrentPage?.length > 0 ? (
                elementsCurrentPage?.map((movie) => (
                  <Card key={movie.id} movie={movie} />
                ))
              ) : (
                <h2>Мы ничего не нашли по запросу {getMoviesPayload()}</h2>
              )}
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
              current={currentNumberPagePagination}
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
