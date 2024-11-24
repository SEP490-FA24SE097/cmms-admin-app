import NextAuth from "next-auth";
import { user } from "./respon-user";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */

  interface Session {
    user: {
      //   id: string;
      //   email: string;
      //   roleName: string;
      //   name: string;
      //   phone:string;
      //   gender:string;
      //   avatarUrl: string;
      //   roleId: number;
      accessToken: string;
      refreshToken: string;
      user: user;
      //   emailVerified?: Date | null;
    };
  }
}
