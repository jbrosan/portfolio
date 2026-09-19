import { Link } from "@tanstack/react-router";

import { portfolioNavigation } from "../lib/portfolio-navigation";
import { ColorModeButton } from "./color-mode-button";
import { LogoutButton } from "./logout-button";

type PortfolioHeaderProps = {
  isAdmin?: boolean;
  mode: "public" | "protected";
};

export function PortfolioHeader({ isAdmin = false, mode }: PortfolioHeaderProps) {
  return (
    <header className="fixed inset-x-0 top-2 z-50 flex justify-center px-2 sm:top-4">
      <nav
        aria-label="Portfolio navigation"
        className="flex max-w-[calc(100vw-1rem)] items-center gap-1 overflow-x-auto rounded-full border border-neutral-200/70 bg-white/85 px-2 py-1.5 shadow-lg shadow-neutral-950/5 backdrop-blur-md dark:border-neutral-800/80 dark:bg-neutral-950/80 dark:shadow-black/30"
      >
        {portfolioNavigation.map((item) =>
          item.implemented ? (
            <Link
              activeProps={{
                className: "bg-neutral-200 text-neutral-950 dark:bg-neutral-800 dark:text-white",
              }}
              className="whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-950 dark:text-neutral-300 dark:hover:bg-neutral-900 dark:hover:text-white"
              key={item.label}
              to={item.to}
            >
              {item.label}
            </Link>
          ) : (
            <span
              aria-disabled="true"
              className="cursor-not-allowed whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-neutral-400 dark:text-neutral-600"
              key={item.label}
              title="Coming in a later restoration slice"
            >
              {item.label}
            </span>
          ),
        )}

        <span
          aria-hidden="true"
          className="mx-1 h-5 w-px shrink-0 bg-neutral-200 dark:bg-neutral-800"
        />

        {mode === "public" ? (
          <>
            <Link
              className="whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-950 dark:text-neutral-300 dark:hover:bg-neutral-900 dark:hover:text-white"
              to="/signup"
            >
              Request access
            </Link>
            <Link
              className="whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-950 dark:text-neutral-300 dark:hover:bg-neutral-900 dark:hover:text-white"
              to="/login"
            >
              Log in
            </Link>
          </>
        ) : (
          <>
            {isAdmin ? (
              <Link
                className="whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-950 dark:text-neutral-300 dark:hover:bg-neutral-900 dark:hover:text-white"
                to="/admin/access"
              >
                Manage Access
              </Link>
            ) : null}
            <LogoutButton />
          </>
        )}

        <ColorModeButton />
      </nav>
    </header>
  );
}
