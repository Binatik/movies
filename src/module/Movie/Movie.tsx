import { Tabs } from "antd";
import { Popular } from ".";
import { useEffect } from "react";
import { useErrorApi } from "../../hooks/useErrorApi";
import { MoviesService } from "../../api/MoviesService";
import Cookies from "js-cookie";
import { IFetchError, IServerError } from "../../api/api.types";

const api = new MoviesService();

const rootHeaders = {
  Authorization: api.getToken,
  accept: "application/json",
};

function Movie() {
  const { getErrorApi } = useErrorApi();

  useEffect(() => {
    const createSession = async () => {
      try {
        const session = !api.getSession && (await api.getCreateGuestSession(rootHeaders));
        session &&
          Cookies.set("guest_session_id", session.guest_session_id, {
            expires: 1,
          });
      } catch (error) {
        const _errorApi = error as IFetchError;
        const _errorServer = error as IServerError;

        if (api.isApiError(_errorApi)) {
          getErrorApi(_errorApi);
          throw _errorApi;
        } else if (api.isApiResponse(_errorServer)) {
          throw _errorServer;
        }
      }
    };
    createSession();
  }, []);

  return (
    <Tabs tabBarStyle={{ width: "140px", margin: "0 auto 19px auto" }} size="large" centered>
      <Tabs.TabPane tab="Search" key="item-1">
        <Popular />
      </Tabs.TabPane>
      <Tabs.TabPane tab="Rated" key="item-2">
        Content
      </Tabs.TabPane>
    </Tabs>
  );
}

export { Movie };
