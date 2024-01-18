import { useState } from "react";
import { IFetchError } from "../api/api.types";

function useErrorApi() {
  const [errorApi, setErrorApi] = useState<IFetchError>({
    message: null,
    status: false,
    payload: null,
  }); //Для обработки если проблемы с сетью.

  const getErrorApi = (error: IFetchError) => {
    setErrorApi(error);
  };

  return { errorApi, getErrorApi };
}

export { useErrorApi };
