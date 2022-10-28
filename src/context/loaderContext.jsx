import React, { createContext, useContext, useState } from "react";
import AnimatedLogo from "../components/animated-logo/animatedLogo";

const DEFAULT_STATE = {
  updateLoader: (loading) => null,
};

const LoaderContext = createContext(DEFAULT_STATE);

export function useLoader() {
  const context = useContext(LoaderContext);

  if (!context) {
    throw new Error("useLoader cannot be used without declaring the provider");
  }

  return context;
}

export function LoaderContextProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoaderContext.Provider value={{ updateLoader: setIsLoading }}>
      {children}
      <AnimatedLogo loading={isLoading} />
    </LoaderContext.Provider>
  );
}
