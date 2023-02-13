import NextAuth, { type NextAuthOptions, User, Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";

import clientPromise from "@/lib/mongodb";

import type { JWT } from "next-auth/jwt";

type AuthToken = JWT & {
  accessToken: string;
  accessTokenExpires: string;
  refreshToken: string;
  user: User;
  error?: string;
};

type SessionType = {
  session: ExtendedSession;
  token: AuthToken;
};

type ExtendedSession = Session & {
  accessToken?: string;
  error?: string;
};

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
      authorization: {
        params: {
          prompt: "select_account",
          response_type: "code",
          access_type: "offline",
          scope:
            "openid email profile https://www.googleapis.com/auth/calendar.readonly",
        },
      },
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.JWT_SECRET as string,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: async ({ token, account, user }) => {
      // Initial sign in
      if (account && user) {
        return {
          accessToken: account.access_token,
          accessTokenExpires: (account.expires_at! || 0) * 1000,
          refreshToken: account.refresh_token,
          user,
        };
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < token.accessTokenExpires!) {
        return token;
      }

      return await refreshAccessToken(token as AuthToken);
    },
    // @ts-ignore
    session: async ({ session, token }: SessionType) => {
      session.user = token.user;
      session.accessToken = token.accessToken;
      session.error = token.error;

      return session;
    },
  },
};

export default NextAuth(authOptions);

const refreshAccessToken = async (token: AuthToken) => {
  try {
    const url =
      "https://oauth2.googleapis.com/token?" +
      new URLSearchParams({
        client_id: process.env.GOOGLE_ID as string,
        client_secret: process.env.GOOGLE_SECRET as string,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      });

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.log(error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
};
