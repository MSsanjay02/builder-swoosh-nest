import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export function usePreferences() {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem("theme") as Theme) || "light");
  const [highContrast, setHighContrast] = useState<boolean>(() => localStorage.getItem("hc") === "1");
  const [fontScale, setFontScale] = useState<number>(() => Number(localStorage.getItem("fs")) || 100);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("hc", highContrast);
    localStorage.setItem("hc", highContrast ? "1" : "0");
  }, [highContrast]);

  useEffect(() => {
    const clamped = Math.max(75, Math.min(150, fontScale));
    document.documentElement.style.setProperty("--font-scale", `${clamped}%`);
    localStorage.setItem("fs", String(clamped));
  }, [fontScale]);

  return { theme, setTheme, highContrast, setHighContrast, fontScale, setFontScale };
}
