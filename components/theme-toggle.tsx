"use client";

import { useEffect } from "react";

const STORAGE_KEY = "wabog-theme";

function getInitialTheme(): "dark" | "light" {
  if (typeof document === "undefined") return "light";
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "dark" ? "dark" : "light";
}

export function ThemeToggle() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", getInitialTheme());
  }, []);

  function toggle() {
    const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(STORAGE_KEY, next);
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label="Cambiar tema"
      onClick={toggle}
      data-analytics="theme_toggle"
    >
      ☾
    </button>
  );
}