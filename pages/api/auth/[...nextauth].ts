import NextAuth, { Awaitable } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { dbUsers } from "../../../database";
import { IUser } from "../../../interfaces";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Credentials({
      name: "Custom login",
      credentials: {
        email: {
          label: "Correo:",
          type: "email",
          placeholder: "example@example.com",
        },
        password: {
          label: "Contraseña:",
          type: "password",
          placeholder: "Contraseña",
        },
      },
      authorize: async (credentials) => {
        const result = await dbUsers.checkUserEmailPassword(
          credentials?.email,
          credentials?.password
        );
        return (await dbUsers.checkUserEmailPassword(
          credentials?.email,
          credentials?.password
        )) as any;
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/register",
  },
  session:{
    maxAge: 60 * 60 * 24 * 30, // 30 días
    strategy: "jwt",
    updateAge: 24 * 60 * 60, // Cada día
  },
  // Callbacks
  callbacks: {
    async jwt({ token, account, user }: any) {
      if (account) {
        token.accessToken = account.access_token;
        switch (account.type) {
          case "oauth":
            token.user = await dbUsers.oAuthToDbUser(
              user?.email || "",
              user?.name || ""
            );
            break;
          case "credentials":
            token.user = user;
            break;
        }
      }
      return token;
    },
    async session({ session, token, user }: any) {
      session.accessToken = token.accessToken;
      session.user = token.user;
      return session;
    },
  },
});
