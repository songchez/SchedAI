"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Select, SelectItem } from "@heroui/react";
import { Switch } from "@heroui/react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";

export const themes = [
  { key: "system", label: "System" },
  { key: "dark", label: "Dark" },
  { key: "light", label: "Light" },
];

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div>
      <Select
        className="w-32 md:inline-block hidden"
        placeholder={theme}
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
      >
        {themes.map((theme) => (
          <SelectItem key={theme.key}>{theme.label}</SelectItem>
        ))}
      </Select>
      <Switch
        className="md:hidden"
        defaultSelected
        size="sm"
        onValueChange={(value) => {
          if (value) {
            setTheme("light");
          } else {
            setTheme("dark");
          }
        }}
        endContent={<MoonIcon />}
        startContent={<SunIcon />}
      ></Switch>
    </div>
  );
}
