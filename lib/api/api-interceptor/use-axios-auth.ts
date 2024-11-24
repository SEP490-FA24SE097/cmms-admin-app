"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { axiosAuth } from "./api";
import { useRefreshToken } from "./use-refresh-token";

const useAxiosAuth = () => {
  const { data: session, update } = useSession();
  const refreshToken = useRefreshToken();

  useEffect(() => {
    const requestIntercept = axiosAuth.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers[
            "Authorization"
          ] = `Bearer ${session?.user.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosAuth.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true;
          await refreshToken();
          update({
            ...session?.user,
            user: {
              ...session?.user,
              accessToken: session?.user.accessToken,
            },
          });
          prevRequest.headers[
            "Authorization"
          ] = `Bearer ${session?.user.accessToken}`;
          return axiosAuth(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosAuth.interceptors.request.eject(requestIntercept);
      axiosAuth.interceptors.response.eject(responseIntercept);
    };
  }, [session, refreshToken, update]);

  return axiosAuth;
};

export default useAxiosAuth;
