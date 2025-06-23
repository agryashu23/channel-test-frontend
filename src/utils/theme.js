import { useEffect, useState } from "react";

const ThemeToggleButton = () => {
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("theme") !== "light"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="px-3 py-2 bg-theme-tertiaryBackground text-theme-primaryText rounded-md text-sm font-light"
    >
      {isDark ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
};

export default ThemeToggleButton;
