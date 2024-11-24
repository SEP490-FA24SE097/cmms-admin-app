import axios from "axios";

import { auth, update } from "@/lib/next-auth/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

export const axiosAuth = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

axiosAuth.interceptors.request.use(
  async (config) => {
    const session = await auth();

    if (!config.headers["Authorization"]) {
      config.headers["Authorization"] = `Bearer ${session?.user?.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// axiosAuth.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const session = await auth();
//     const prevRequest = error?.config;
//     if (error?.response?.status === 401 && !prevRequest?.sent) {
//       prevRequest.sent = true;

//       const updatedSession = await refreshToken(session);

//       const sessionChange = await update({
//         user: {
//           accessToken: updatedSession,
//         },
//       });

//       prevRequest.headers[
//         "Authorization"
//       ] = `Bearer ${sessionChange?.user?.accessToken}`;
//       return axiosAuth(prevRequest);
//     }
//     return Promise.reject(error);
//   }
// );
