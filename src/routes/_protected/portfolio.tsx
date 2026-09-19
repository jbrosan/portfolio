import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/portfolio")({
  component: PortfolioPage,
});

function PortfolioPage() {
  const { access } = Route.useRouteContext();

  return (
    <main className="min-h-svh bg-background px-6 py-16 text-foreground">
      <section className="mx-auto max-w-5xl space-y-5">
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-neutral-500">
          Dale Waugh
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">Portfolio</h1>
        <p className="max-w-2xl text-lg leading-8 text-neutral-600">
          Authenticated access is active for {access.user.email}. Portfolio content restoration
          comes next.
        </p>
      </section>
    </main>
  );
}
