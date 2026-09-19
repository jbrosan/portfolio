import { createFileRoute } from "@tanstack/react-router";

import { FeatureVideoCard } from "../../components/feature-video-card";
import { PortfolioHeader } from "../../components/portfolio-header";

export const Route = createFileRoute("/_protected/bio")({
  component: BioPage,
});

function BioPage() {
  const { access } = Route.useRouteContext();

  return (
    <main className="min-h-svh bg-neutral-50 px-4 pb-10 pt-24 text-neutral-950 transition-colors dark:bg-neutral-950 dark:text-white sm:px-6 sm:pt-28">
      <PortfolioHeader isAdmin={access.role === "admin"} mode="protected" />

      <section className="mx-auto max-w-6xl py-10">
        <FeatureVideoCard
          videoFit="contain"
          kicker="Dale Waugh"
          title="Biography"
          videoSrc="/videos/dale-waugh-bio.webm"
        />
      </section>
    </main>
  );
}
