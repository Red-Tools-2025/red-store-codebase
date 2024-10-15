import Credentials from "next-auth/providers/credentials";

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

import { type NextAuthOptions } from "next-auth";
import { type Adapter } from "next-auth/adapters";

import bcrypt from "bcryptjs";
import { db } from "@/lib/prisma";

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "email", placeholder: "Enter Email", type: "text" },
        password: { label: "password", placeholder: "*****", type: "text" },
      },
      async authorize(credentials) {
        // Ensures that there is data in the form to check
        if (!credentials?.email || !credentials.password) return null;
        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });

        // unable to fetch user based on provided email, hence invalid or no account
        if (!user) return null;

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        // Invalid password enterd, hash comparison failed
        if (!isPasswordValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          roleId: user.roleId,
        };
      },
    }),
  ],
  // Using webtokens for generating sessions, rather than storing session values in database
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
  },
  callbacks: {
    // following signIn callback only applicable for google account providers
    signIn: async ({ user, account, profile }) => {
      if (account && account.provider === "google") {
        const existingUser = await db.user.findUnique({
          where: { email: profile?.email ?? "" },
        });

        if (existingUser) {
          const existingAccount = await db.account.findUnique({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            },
          });

          if (!existingAccount) {
            await db.account.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                refresh_token: account.refresh_token,
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                session_state: account.session_state,
              },
            });
          }

          console.log("Account linked successfully");
        }
      }
      return true;
    },
    // modied the toke call back to return the email and user name via the generated jwt token
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    // modified the session call back to return the session string along with the user object, for validating, and a normal session if no user found
    async session({ session, token, user }) {
      if (user) {
        return {
          ...session,
          user: {
            ...token,
            id: user.id,
          },
        };
      }
      return session;
    },
  },
};

export default authOptions;
