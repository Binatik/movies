export type IHttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export type IMessage = "FetchError";

export type IError = {
  status: boolean;
  payload: null;
};

export type IFetchError = {
  message: "FetchError" | null;
} & IError;

export type IServerError = {
  message: "ServerError" | null;
} & IError;

export interface IMovie {
  adult: boolean;
  backdrop_path: string;
  genre_ids?: number[] | null;
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface RootMovie {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export interface IGustSession {
  success: boolean;
  guest_session_id: string;
  expires_at: string;
}
