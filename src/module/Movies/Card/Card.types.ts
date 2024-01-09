import { IMovie } from "../../../service/api/api.types"

export type ICardMovieProps = {
  setMovies?: React.Dispatch<React.SetStateAction<IMovie[]>>
  movie: IMovie
}