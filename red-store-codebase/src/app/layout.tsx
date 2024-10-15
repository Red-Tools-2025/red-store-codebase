import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ThemeProvider from "@/app/providers/theme-provider";
import NextAuthProvider from "./providers/NextAuthProvider";
import { getSession } from "next-auth/react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Akshat Sabavat Portfolio Page",
  description: "Welcome to my web portfolio !!",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          disableTransitionOnChange
          enableSystem
          defaultTheme="light"
        >
          <NextAuthProvider session={session}>{children}</NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
