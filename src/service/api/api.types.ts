export interface Dates { 
  maximum: string;
  minimum: string;
}

export interface Results { 
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

export interface RootObject { 
  dates: Dates;
  page: number;
  results: Results[];
  total_pages: number;
  total_results: number;
}