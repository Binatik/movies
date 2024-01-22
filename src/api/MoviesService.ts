// import { ExceptionMethods } from "./ExceptionMethods";
import { IFetchError, IGenre, IGustSession, IHttpMethod, IServerError, RootMovie } from "./api.types";
import Cookies from "js-cookie";

class MoviesService {
  //this api env in declare
  key: string;
  token: string;
  api: "https://api.themoviedb.org/3";

  constructor() {
    this.token =
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZDEwYTMzMTg4ZWZkOTU3YWMzMzlhNTljNzY2MmJiOCIsInN1YiI6IjY1OWJmNWY1Y2E0ZjY3MDFhNDNkN2YwNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.J-1PvFXJi6TEswEbh8Ra-NiwID1KZxyLNKXPMQZACEY";
    this.key = "1d10a33188efd957ac339a59c7662bb8";
    this.api = `https://api.themoviedb.org/3`;
  }

  get getKey() {
    return this.key;
  }

  get getToken() {
    return this.token;
  }

  get getSession() {
    return Cookies.get("guest_session_id");
  }

  async getResponse<T>(url: string, fetchOptions: RequestInit): Promise<T> {
    try {
      const request = `${this.api + url}`;
      const response: Response = await fetch(request, fetchOptions);
      if (!response.ok) {
        return Promise.reject({
          message: "ServerError",
          status: true,
          payload: response.status,
        });
      }
      return response.json();
    } catch (error) {
      return Promise.reject({
        message: "FetchError",
        status: true,
        payload: "Network problems",
      });
    }
  }

  async getCreateGuestSession(headers: HeadersInit) {
    const method: IHttpMethod = "GET";
    const fetchOptions = {
      method: method,
      headers,
    };

    return this.getResponse<Promise<IGustSession>>(`/authentication/guest_session/new`, fetchOptions);
  }

  async getPopularMovie(language: "ru-RU" | "en-US", page: number, headers?: HeadersInit) {
    const method: IHttpMethod = "GET";
    const fetchOptions = {
      method: method,
      headers,
    };
    return this.getResponse<Promise<RootMovie>>(
      `/movie/popular?language=${language}&page=${page.toString()}`,
      fetchOptions,
    );
  }

  async getRatedMovies(
    language: "ru-RU" | "en-US",
    page: number,
    sort: "created_at.asc" | "created_at.desc",
    headers?: HeadersInit,
  ) {
    const method: IHttpMethod = "GET";

    const fetchOptions = {
      method: method,
      headers,
    };
    return this.getResponse<Promise<RootMovie>>(
      `/guest_session/${Cookies.get("guest_session_id")}/rated/movies?api_key=${this.getKey}&language=${language}&page=${page.toString()}&sort_by=${sort}`,
      fetchOptions,
    );
  }

  async postAddRating(movieId: number, body: BodyInit, headers?: HeadersInit) {
    const method: IHttpMethod = "POST";
    const fetchOptions = {
      method: method,
      headers,
      body: body,
    };

    return this.getResponse<Promise<unknown>>(
      `/movie/${movieId.toString()}/rating?guest_session_id=${Cookies.get("guest_session_id")}&api_key=${this.getKey}`,
      fetchOptions,
    );
  }

  async deleteRating(movieId: number, headers?: HeadersInit) {
    const method: IHttpMethod = "DELETE";
    const fetchOptions = {
      method: method,
      headers,
    };

    return this.getResponse<Promise<unknown>>(
      `/movie/${movieId.toString()}/rating?guest_session_id=${Cookies.get("guest_session_id")}&api_key=${this.getKey}`,
      fetchOptions,
    );
  }

  async getSearchMovies(
    query: string,
    include_adult: boolean,
    language: "ru-RU" | "en-US",
    page: number,
    headers?: HeadersInit,
  ) {
    const method: IHttpMethod = "GET";
    const fetchOptions = {
      method: method,
      headers,
    };
    return this.getResponse<Promise<RootMovie>>(
      `/search/movie?query=${query}&include_adult=${include_adult}&language=${language}&page=${page.toString()}&api_key=${this.getKey}`,
      fetchOptions,
    );
  }

  async getGenres(language: "ru-RU" | "en-US", headers?: HeadersInit) {
    const method: IHttpMethod = "GET";
    const fetchOptions = {
      method: method,
      headers,
    };
    return this.getResponse<Promise<IGenre>>(`/genre/movie/list?language=${language}`, fetchOptions);
  }

  isApiError(error: IFetchError) {
    if (error.message) {
      return ["FetchError"].includes(error.message);
    }
  }

  isApiResponse(error: IServerError) {
    if (error.message) {
      return ["ServerError"].includes(error.message);
    }
  }
}

export { MoviesService };
