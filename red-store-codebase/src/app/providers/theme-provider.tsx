import { type ThemeProviderProps } from "next-themes/dist/types";
import { ThemeProvider as NextThemeProvider } from "next-themes";

import React from "react";

const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  ...props
}) => {
  return <NextThemeProvider {...props}>{children}</NextThemeProvider>;
};

export default ThemeProvider;
