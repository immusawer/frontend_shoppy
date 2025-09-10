"use client";
import { ThemeProvider } from "@mui/material";
import darktheme from "./dark.theme";
import { ReactElement } from "react";
import { AuthContext } from "./(auth)/auth-context";

interface ProviderProps {
  children: ReactElement[];
  authenticated: boolean;
}

export default function Provider({ children, authenticated }: ProviderProps) {
  return (
    <ThemeProvider theme={darktheme}>
      <AuthContext.Provider value={{ isAuthenticated: authenticated, setIsAuthenticated: () => {} }}>
        {children}
      </AuthContext.Provider>
    </ThemeProvider>
  );
}
