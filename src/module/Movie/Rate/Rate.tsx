import { Alert, Flex } from "antd";
import { useErrorApi } from "../../../hooks/useErrorApi";
import { IFetchError, IServerError } from "../../../api/api.types";
import { IMoviesFilter } from "./Rate.types";
import { useEffect, useMemo, useState } from "react";
import { MoviesService } from "../../../api/MoviesService";
import { getElementsPagination } from "../../../helpers/getElementsPagination";
import { Card } from "../Card";
import { Pagination, SpinOutlined } from "../../../ui";

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
const counterCurrentPage = 5; //Кол - во элементов на одну стр.

const rootHeaders = {
  accept: "application/json",
};

function Rate() {
  const { errorApi, getErrorApi } = useErrorApi();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState<IServerError>(templateError);

  const [rateMovies, setRateMovies] = useState(templateMovies);
  const [currentNumberPagePagination, setCurrentNumberPagePagination] = useState(1);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const result = await api.getRatedMovies("ru-RU", 1, "created_at.asc", rootHeaders);
        setRateMovies((prev) => ({ ...prev, data: result }));
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
    const data = rateMovies.data;
    if (!data) return;

    return getElementsPagination(data.results, currentNumberPagePagination, counterCurrentPage);
  }, [rateMovies, currentNumberPagePagination]);

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
      const result = await api.getRatedMovies("ru-RU", pageServer, "created_at.asc", rootHeaders);

      setRateMovies((prev) => {
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

  function renderMovieList() {
    const isContainerError = !elementsCurrentPage?.length && !errorApi.status;

    if (isError.status) {
      return <h1>Ошибка загрузки {isError.payload}</h1>;
    }

    return (
      <SpinOutlined isLoading={isLoading} isErrorApi={errorApi.status}>
        {elementsCurrentPage?.map((movie) => <Card key={movie.id} movie={movie} />)}

        {isContainerError && <h2>Пока пусто, добавь фильм и не теряй его!</h2>}
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
          closable
        />
      )}
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
            total={rateMovies.data?.results.length}
          />
        )}
      </Flex>
      <br />
      <br />
    </>
  );
}

export { Rate };
