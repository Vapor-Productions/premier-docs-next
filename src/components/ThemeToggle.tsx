"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = window.localStorage.getItem("pp-docs-theme") as Theme | null;
    const preferred =
      stored ??
      (window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark");
    setTheme(preferred);
    applyTheme(preferred);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    window.localStorage.setItem("pp-docs-theme", next);
    applyTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="docs-theme-toggle"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  );
}
