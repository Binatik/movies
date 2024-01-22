import { createContext, useState } from "react";
import { useEffect } from "react";
import { MoviesService } from "../../../../api/MoviesService";
import { IFetchError, IGenre, IServerError } from "../../../../api/api.types";
import { useErrorApi } from "../../../../hooks/useErrorApi";

export interface IModalContextProvider {
  children: React.ReactNode;
}

const api = new MoviesService();

export const MovieContext = createContext<IGenre | null>(null);

const rootHeaders = {
  Authorization: api.getToken,
  accept: "application/json",
};

function MovieContextProvider({ children }: IModalContextProvider) {
  const { getErrorApi } = useErrorApi();
  const [genres, setGenre] = useState<IGenre | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const result = await api.getGenres("ru-RU", rootHeaders);
        setGenre(result);
      } catch (error) {
        const _errorApi = error as IFetchError;
        const _errorServer = error as IServerError;

        if (api.isApiError(_errorApi)) {
          getErrorApi(_errorApi);
          throw _errorApi;
        } else if (api.isApiResponse(_errorServer)) {
          throw _errorServer;
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchGenres();
  }, []);

  return !isLoading && <MovieContext.Provider value={genres}>{children}</MovieContext.Provider>;
}

export { MovieContextProvider };
