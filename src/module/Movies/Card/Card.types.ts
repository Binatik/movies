import { Results } from "../../../service/api/api.types"

export type ICardMovieProps = {
  setMovies?: React.Dispatch<React.SetStateAction<Results[]>>
  movie: Results
}