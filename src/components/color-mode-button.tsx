import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

function readDarkMode() {
  return document.documentElement.classList.contains("dark");
}

export function ColorModeButton() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(readDarkMode());
  }, []);

  function applyMode(nextDark: boolean) {
    document.documentElement.classList.toggle("dark", nextDark);
    localStorage.setItem("portfolio:color-mode", nextDark ? "dark" : "light");
    setDark(nextDark);
  }

  function toggleColorMode(event: React.MouseEvent<HTMLButtonElement>) {
    const nextDark = !readDarkMode();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      applyMode(nextDark);
      return;
    }

    const startViewTransition = document.startViewTransition?.bind(document);

    if (!startViewTransition) {
      applyMode(nextDark);
      return;
    }

    const x = event.clientX || window.innerWidth / 2;
    const y = event.clientY || window.innerHeight / 2;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    document.documentElement.style.setProperty("--circle-x", `${x}px`);
    document.documentElement.style.setProperty("--circle-y", `${y}px`);
    document.documentElement.style.setProperty("--circle-radius", `${endRadius}px`);

    startViewTransition(() => {
      applyMode(nextDark);
    });
  }

  return (
    <button
      aria-label="Toggle color mode"
      aria-pressed={dark}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-neutral-600 transition hover:bg-neutral-200/70 hover:text-neutral-950 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white"
      onClick={toggleColorMode}
      type="button"
    >
      {dark ? <Sun aria-hidden="true" size={17} /> : <Moon aria-hidden="true" size={17} />}
    </button>
  );
}
