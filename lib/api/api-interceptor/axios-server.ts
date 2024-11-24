import { Session } from "next-auth";
import { axiosAuth } from "./api";
import { update, auth } from "@/lib/next-auth/auth";
import refreshToken from "./refresh-token-server";

const setupAxiosAuth = async (session: Session | null) => {
  axiosAuth.interceptors.request.use(
    (config) => {
      if (!config.headers["Authorization"]) {
        config.headers[
          "Authorization"
        ] = `Bearer ${session?.user?.accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosAuth.interceptors.response.use(
    (response) => response,
    async (error) => {
      const prevRequest = error?.config;
      if (error?.response?.status === 401 && !prevRequest?.sent) {
        prevRequest.sent = true;

        const updatedSession = await refreshToken(session);

        const sessionChange = await update({
          user: {
            accessToken: updatedSession,
          },
        });

        prevRequest.headers[
          "Authorization"
        ] = `Bearer ${sessionChange?.user?.accessToken}`;
        return axiosAuth(prevRequest);
      }
      return Promise.reject(error);
    }
  );
};

export default setupAxiosAuth;
