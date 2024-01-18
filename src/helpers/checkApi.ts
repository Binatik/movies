// import { MoviesService } from "../api/MoviesService";
// import { IFetchError, IServerError } from "../api/api.types";

// function checkApi<T>(api: MoviesService, error: T, callback?: (error: IServerError) => void) {
//   //callback во сновном для состояний компонетов, например ErrorResponse.

//   const errorApi = error as IFetchError;
//   const errorSerever = error as IServerError;

//   if (api.isApiError(errorApi)) {
//     setErrorApi(errorApi);
//   } else if (api.isApiResponse(errorSerever)) {
//     if (!callback) return;
//     callback(errorSerever);
//   }
// }
