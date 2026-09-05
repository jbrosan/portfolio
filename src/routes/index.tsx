import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <main className="min-h-svh bg-background text-foreground">
      <section className="mx-auto flex min-h-svh max-w-5xl items-center px-6 py-16">
        <div className="space-y-5">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-neutral-500">
            Dale Waugh
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
            Portfolio rewrite baseline
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-neutral-600">
            TanStack Start is running on Bun. The original portfolio functionality will be restored
            and completed slice by slice from this clean baseline.
          </p>
        </div>
      </section>
    </main>
  );
}
