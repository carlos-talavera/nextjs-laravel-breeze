"use client";

import { ThemeProvider } from "@/context/ThemeProvider";
import { UserProvider } from "@/context/UserProvider";
import React from "react";

interface ParentProviderProps {
  children: React.ReactNode;
}

const ParentProvider = ({ children }: ParentProviderProps) => {
  return (
    <UserProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </UserProvider>
  );
};

export default ParentProvider;
