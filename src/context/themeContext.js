import React from "react";
import { ThemeProvider as Theme } from "styled-components";

const theme = {
  colors: {
    white: "#fff",
    secondaryWhite: "#FAFAFA",
    black: "#000",
    secondaryBlack: "#212121",
    blue: "#1D8AED",
    green: "#C5EC4B",
    transparent: "transparent",
    gray: "#5F6569",
  },
  opacity: {
    five: "0.5",
  },
  backgroundBorder: `linear-gradient(to right,  #C5EC4B 27%, #C5EC4B 100%) right bottom no-repeat`,
};

function ThemeProvider({ children }) {
  return <Theme theme={theme}>{children}</Theme>;
}

export default ThemeProvider;
