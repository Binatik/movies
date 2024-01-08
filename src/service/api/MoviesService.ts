import { RootObject } from "./api.types";

class MoviesService {
  api: 'https://api.themoviedb.org/3'

  constructor() {
    this.api = `https://api.themoviedb.org/3`
  }

  async getResponse<T>(url: string, headers: Record<string, string>): Promise<T> {
    const request = `${this.api + url}`;
    const res: Response = await fetch(request, {
      headers
    });

    return await res.json()
  }


  async getPopularMovie(language: 'ru-US' | 'en-US', page: number, headers: Record<string, string>) {
    return this.getResponse<Promise<RootObject>>(`/movie/now_playing?language=${language}&page=${page.toString()}`, headers)
  }
}

export { MoviesService }


// headers: {
//   "Authorization": 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZDEwYTMzMTg4ZWZkOTU3YWMzMzlhNTljNzY2MmJiOCIsInN1YiI6IjY1OWJmNWY1Y2E0ZjY3MDFhNDNkN2YwNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.J-1PvFXJi6TEswEbh8Ra-NiwID1KZxyLNKXPMQZACEY',
//   "accept": 'application/json'
// }