import Credentials from "next-auth/providers/credentials";

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

import { type NextAuthOptions } from "next-auth";
import { type Adapter } from "next-auth/adapters";

import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
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
        const user = await prisma.user.findUnique({
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
  callbacks: {
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
