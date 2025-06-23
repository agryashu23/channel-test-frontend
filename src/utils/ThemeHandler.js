import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const ThemeHandler = () => {
  const theme = useSelector((state) => state.theme.theme);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return null;
};

export default ThemeHandler;
