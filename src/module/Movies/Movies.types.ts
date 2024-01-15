import { IFetchError, IServerError, RootMovie } from "../../api/api.types";

export type UnwrapPromise<T> = T extends Promise<infer K> ? K : T;

export type IMoviesFilter = {
  loading: boolean;
  data: RootMovie | null;
  error: IFetchError | IServerError;
  payload: unknown;
};
