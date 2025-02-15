import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ThemeProvider from "@/app/providers/theme-provider";
import StructureProvider from "./providers/StructureProvider";
import { AuthProvider } from "./providers/AuthProvider";

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
  title: "Red Store",
  description: "POS/IM Tool",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-inter`}
      >
        <ThemeProvider
          attribute="class"
          disableTransitionOnChange
          enableSystem
          defaultTheme="light"
        >
          <AuthProvider>
            <StructureProvider>{children}</StructureProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
