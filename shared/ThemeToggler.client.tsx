"use client";

import { useTheme } from "next-themes";
import { PiMoonDuotone, PiSunDuotone } from "react-icons/pi";
import Button from "./Button.client";

export default function ThemeToggler() {
  const { setTheme, systemTheme, theme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  const toggleTheme = () => {
    setTheme(currentTheme === "light" ? "dark" : "light");
  };

  return (
    <Button
      icon={currentTheme === "light" ? <PiMoonDuotone /> : <PiSunDuotone />}
      onClick={toggleTheme}
      variant="ghost"
    />
  );
}
