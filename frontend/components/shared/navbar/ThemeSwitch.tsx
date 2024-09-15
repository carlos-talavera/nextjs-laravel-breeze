"use client"

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/context/ThemeProvider";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";

const ThemeSwitch = () => {
  const { mode, setMode } = useTheme()

  return (
    <div
      className="flex max-w-fit items-center justify-between"
    >
      <Switch
        id="theme-switch"
        checked={mode === "dark"}
        onClick={() => {
          setMode(mode === "dark" ? "light" : "dark")

          localStorage.setItem(
            "theme",
            mode === "dark" ? "light" : "dark"
          );
        }}
        className={`h-6 w-11 ${mode === "dark" ? "bg-teal-500" : "bg-gray-200"}`}
      />
      <Label htmlFor="theme-switch" className="ml-2 size-[18px] text-slate-600 dark:text-white">
        {mode === "dark"
          ? <SunIcon />
          : <MoonIcon />
        }
      </Label>
    </div>
  )
}

export default ThemeSwitch