import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { MoviesService } from "../../../api/MoviesService";
import { IMoviesFilter } from "./Popular.types";
import { Alert, Flex, Input } from "antd";
import debounce from "lodash.debounce";
import { Pagination, SpinOutlined } from "../../../ui";
import { getElementsPagination } from "../../../helpers/getElementsPagination";
import { IFetchError, IServerError } from "../../../api/api.types";
import { Card } from "../Card";
import { useErrorApi } from "../../../hooks/useErrorApi";

const api = new MoviesService();

const templateMovies: IMoviesFilter = {
  data: null,
  payload: null,
};

const templateError: IServerError = {
  message: null,
  status: false,
  payload: null,
};

let pageServer = 1;

const cachePages = new Map<number, number>();
const counterCurrentPage = 10; //Кол - во элементов на одну стр.

const rootHeaders = {
  Authorization: api.getToken,
  accept: "application/json",
};

function Popular() {
  const { errorApi, getErrorApi } = useErrorApi();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState<IServerError>(templateError);

  const [popularMovies, setPopularMovies] = useState(templateMovies);
  const [currentNumberPagePagination, setCurrentNumberPagePagination] = useState(1);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const result = await api.getPopularMovie("ru-RU", 1, rootHeaders);
        setPopularMovies((prev) => ({ ...prev, data: result }));
      } catch (error) {
        const _errorApi = error as IFetchError;
        const _errorServer = error as IServerError;

        if (api.isApiError(_errorApi)) {
          getErrorApi(_errorApi);
          throw _errorApi;
        } else if (api.isApiResponse(_errorServer)) {
          setIsError(_errorServer);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovies();
  }, []);

  //Получаем элементы нужной стр.
  const elementsCurrentPage = useMemo(() => {
    const data = popularMovies.data;
    if (!data) return;

    return getElementsPagination(data.results, currentNumberPagePagination, counterCurrentPage);
  }, [popularMovies, currentNumberPagePagination]);

  async function updateMovies(page: number) {
    setCurrentNumberPagePagination(page);

    if (page % 2 !== 0) {
      return;
    }

    try {
      if (cachePages.has(page)) {
        return;
      }

      pageServer += 1;
      setIsLoading(true);
      const result = await api.getPopularMovie("ru-RU", pageServer, rootHeaders);

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
      const _errorApi = error as IFetchError;
      const _errorServer = error as IServerError;

      if (api.isApiError(_errorApi)) {
        getErrorApi(_errorApi);
        throw _errorApi;
      } else if (api.isApiResponse(_errorServer)) {
        setIsError(_errorServer);
      }
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
        const result = await api.getPopularMovie("ru-RU", 1, rootHeaders);
        setPopularMovies((prev) => ({ ...prev, data: result }));
        return;
      }

      const result = await api.getSearchMovies(inputValue, true, "ru-RU", 1, rootHeaders);
      setPopularMovies((prev) => ({
        ...prev,
        payload: inputValue,
        data: result,
      }));
    } catch (error) {
      const _errorApi = error as IFetchError;
      const _errorServer = error as IServerError;

      const errorApiModify = { ..._errorApi, payload: `Network ${event.currentTarget.value} problems` };

      if (api.isApiError(_errorApi)) {
        getErrorApi(errorApiModify);
        throw errorApiModify;
      } else if (api.isApiResponse(_errorServer)) {
        setIsError(_errorServer);
      }
    } finally {
      setIsLoading(false);
    }
  }

  function renderMovieList() {
    const isContainerError = !elementsCurrentPage?.length && !errorApi.status;

    if (isError.status) {
      return <h1>Ошибка загрузки {isError.payload}</h1>;
    }

    return (
      <SpinOutlined isLoading={isLoading} isErrorApi={errorApi.status}>
        {elementsCurrentPage?.map((movie) => <Card key={movie.id} movie={movie} />)}

        {isContainerError && <h2>Мы ничего не нашли по запросу {popularMovies.payload}</h2>}
      </SpinOutlined>
    );
  }

  return (
    <>
      {errorApi.status && (
        <Alert
          style={{ marginBottom: 10 }}
          message={errorApi.message}
          description={`${errorApi.payload}`}
          type="warning"
          showIcon
        />
      )}
      <Input onChange={debounce(getSearchMovies, 450)} size="large" placeholder="Type to search..." />
      <Flex gap="middle" justify="center" wrap="wrap">
        {renderMovieList()}
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
    </>
  );
}

export { Popular };
