"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Select, SelectItem } from "@nextui-org/react";

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
        className="min-w-32"
        placeholder={theme}
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
      >
        {themes.map((theme) => (
          <SelectItem key={theme.key}>{theme.label}</SelectItem>
        ))}
      </Select>
    </div>
  );
}
