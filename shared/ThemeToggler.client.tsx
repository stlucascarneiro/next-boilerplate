"use client";

import { useTheme } from "next-themes";
import { PiMoonDuotone, PiSunDuotone } from "react-icons/pi";

export default function ThemeToggler() {
  const { setTheme, systemTheme, theme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  const toggleTheme = () => {
    setTheme(currentTheme === "light" ? "dark" : "light");
  };

  return (
    <button onClick={toggleTheme}>
      <PiMoonDuotone className="dark:hidden" />
      <PiSunDuotone className="hidden dark:flex" />
    </button>
  );
}
