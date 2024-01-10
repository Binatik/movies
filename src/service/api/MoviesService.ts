import { IGustSession, IHttpMethod, RootMovie } from "./api.types";
import Cookies from "js-cookie";


class MoviesService {
  //this api env in declare
  key: string
  token: string
  api: 'https://api.themoviedb.org/3'

  constructor() {
    this.token = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZDEwYTMzMTg4ZWZkOTU3YWMzMzlhNTljNzY2MmJiOCIsInN1YiI6IjY1OWJmNWY1Y2E0ZjY3MDFhNDNkN2YwNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.J-1PvFXJi6TEswEbh8Ra-NiwID1KZxyLNKXPMQZACEY'
    this.key = '1d10a33188efd957ac339a59c7662bb8'
    this.api = `https://api.themoviedb.org/3`
  }

  get getKey() {
    return this.key;
  }

  get getToken() {
    return this.token;
  }

  async getResponse<T>(url: string, fetchOptions: RequestInit): Promise<T> {
    try {
      const request = `${this.api + url}`;
      const res: Response = await fetch(request, fetchOptions);
      try {
        if (!res.ok) {
          console.log(res)
          throw new Error('not status ok')
        }

        return res.json()
      }

      catch (error) {
        if (error instanceof Error) {
          console.log(error.message)
        }

        throw error
      }
    }
    catch (error) {
      if (error instanceof Error) {
        console.log('Disconnect internet and vpn')
        console.log(error.message)
      }

      throw error
    }
  }

  async getCreateGuestSession(headers: HeadersInit) {
    const method: IHttpMethod = 'GET';
    const fetchOptions = {
      method: method,
      headers
    };

    return this.getResponse<Promise<IGustSession>>(`/authentication/guest_session/new`, fetchOptions)
  }


  async getPopularMovie(language: 'ru-US' | 'en-US', page: number, headers?: HeadersInit) {
    const method: IHttpMethod = 'GET';
    const fetchOptions = {
      method: method,
      headers
    };
    console.log(`/movie/popular?language=${language}&page=${page.toString()}`)
    return this.getResponse<Promise<RootMovie>>(`/movie/popular?language=${language}&page=${page.toString()}`, fetchOptions)
  }

  async getRatedMovies(language: 'ru-US' | 'en-US', page: number, sort: 'created_at.asc' | 'created_at.desc', headers?: HeadersInit) {
    const method: IHttpMethod = 'GET';

    const fetchOptions = {
      method: method,
      headers
    };
    // `${this._apiBase}/guest_session/${sessionId}/rated/movies?api_key=${this._apiKey}&language=en-US&page=${pageNum}&sort_by=created_at.asc`
    return this.getResponse<Promise<unknown>>(`/guest_session/${Cookies.get('guest_session_id')}/rated/movies?api_key=${this.getKey}&language=${language}&page=${page.toString()}&sort_by=${sort}`, fetchOptions)
  }

  async postAddRating(movieId: number, body: BodyInit, headers?: HeadersInit) {
    const method: IHttpMethod = 'POST'
    const fetchOptions = {
      method: method,
      headers,
      body: body
    };

    return this.getResponse<Promise<unknown>>(`/movie/${movieId.toString()}/rating?guest_session_id=${Cookies.get('guest_session_id')}&api_key=${this.getKey}`, fetchOptions)
  }

  async getSearchMovies(query:string, include_adult: boolean, language: 'ru-US' | 'en-US', page: number, headers?: HeadersInit) {
    const method: IHttpMethod = 'GET';
    const fetchOptions = {
      method: method,
      headers
    };
    return this.getResponse<Promise<RootMovie>>(`/search/movie?query=${query}&include_adult=${include_adult}&language=${language}&page=${page.toString()}`, fetchOptions)
  }
}

export { MoviesService }