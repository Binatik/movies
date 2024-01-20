import { RootMovie } from "../../../api/api.types";

export type IMoviesFilter = {
  data: RootMovie | null;
  payload: React.ReactNode;
};
