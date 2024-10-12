import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
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
          user
        );
      },
    }),
  ],
};

export default authOptions;
