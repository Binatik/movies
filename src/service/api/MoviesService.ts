import { IGustSession, RootMovie } from "./api.types";
import Cookies from "js-cookie";

class MoviesService {
  //this api env in declare
  key: string
  api: 'https://api.themoviedb.org/3'

  constructor() {
    this.key = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZDEwYTMzMTg4ZWZkOTU3YWMzMzlhNTljNzY2MmJiOCIsInN1YiI6IjY1OWJmNWY1Y2E0ZjY3MDFhNDNkN2YwNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.J-1PvFXJi6TEswEbh8Ra-NiwID1KZxyLNKXPMQZACEY'
    this.api = `https://api.themoviedb.org/3`
  }

  getKey () {
    return this.key
  }

  async getResponse<T>(url: string, headers: Record<string, string>): Promise<T> {
    const request = `${this.api + url}`;
    const res: Response = await fetch(request, {
      headers
    });

    return await res.json()
  }

  async getCreateGuestSession(headers: Record<string, string>) {
    return this.getResponse<Promise<IGustSession>>(`/authentication/guest_session/new`, headers)
  }


  async getPopularMovie(language: 'ru-US' | 'en-US', page: number, headers: Record<string, string>) {
    return this.getResponse<Promise<RootMovie>>(`/movie/now_playing?language=${language}&page=${page.toString()}`, headers)
  }
  
  async getRatedMovies(language: 'ru-US' | 'en-US', page: number, sort: 'created_at.asc' | 'created_at.desc', headers: Record<string, string>) {
    return this.getResponse<Promise<unknown>>(`/guest_session/${Cookies.get('guest_session_id')}/rated/movies?language=${language}&page=${page.toString()}&sort_by=${sort}`, headers)
  }
}

export { MoviesService }