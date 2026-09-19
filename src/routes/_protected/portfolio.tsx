import { createFileRoute, Link } from "@tanstack/react-router";

import { PortfolioHeader } from "../../components/portfolio-header";

export const Route = createFileRoute("/_protected/portfolio")({
  component: PortfolioPage,
});

function PortfolioPage() {
  const { access } = Route.useRouteContext();

  return (
    <main className="min-h-svh bg-neutral-50 px-4 pb-10 pt-24 text-neutral-950 transition-colors dark:bg-neutral-950 dark:text-white sm:px-6 sm:pt-28">
      <PortfolioHeader isAdmin={access.role === "admin"} mode="protected" />

      <section className="mx-auto max-w-4xl py-16">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400">
          Access approved
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          Dale Waugh · Portfolio
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-neutral-600 dark:text-neutral-300">
          Your account has access to the protected portfolio. Bio, career, skills, projects,
          education, testimonials, and publications will be restored in the next slices.
        </p>
        <Link
          className="mt-8 inline-flex rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-white dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-900"
          to="/"
        >
          Back to introduction
        </Link>
      </section>
    </main>
  );
}
