import axios from "axios";
import NextAuth, { NextAuthConfig } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { apiRequest } from "../api/api-handler/generic";
import { user } from "@/types/respon-user";

interface UserJWT extends JWT {
  id: string;
  email: string;
  //   roleName: string;
  //   name: string;
  //   phone: string;
  //   gender: string;
  //   avatarUrl: string;
  //   roleId: number;
  user: user;
  accessToken: string;
  refreshToken: string;
  emailVerified: Date | null;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const authOptions: NextAuthConfig = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        userName: { label: "userName", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.userName || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          const result = await apiRequest<{ data: any }>(() =>
            axios.post(`${API_URL}/auth/signIn`, {
              userName: credentials.userName,
              password: credentials.password,
            })
          );

          if (result.success) {
            const { data } = result.data;
            // console.log("vinh check", result.data);
            return { ...data };
          }
        } catch (error) {
          // console.log("vinh check err", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update") {
        return { ...token, ...session.user };
      }
      return { ...token, ...user };
    },
    async session({ session, token }) {
      session.user = token as UserJWT;
      if (token) {
        const {
          id,
          email,
          //   roleName,
          //   name,
          //   phone,
          //   gender,
          //   avatarUrl,
          //   roleId,
          user,
          accessToken,
          refreshToken,
        } = token;
        Object.assign(session.user, {
          id,
          email,
          //   roleName,
          //   name,
          //   phone,
          //   gender,
          //   avatarUrl,
          //   roleId,
          user,
          accessToken,
          refreshToken,
        });
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET!,
};

export const {
  handlers,
  auth,
  signIn,
  signOut,
  unstable_update: update,
} = NextAuth(authOptions);
