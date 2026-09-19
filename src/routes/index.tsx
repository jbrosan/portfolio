import { createFileRoute } from "@tanstack/react-router";

import { FeatureVideoCard } from "../components/feature-video-card";
import { PortfolioHeader } from "../components/portfolio-header";

const introParagraphs = [
  "I am a seasoned executive with over 15 years of leadership experience, driving transformative change across industries such as manufacturing, oil and gas, real estate, retail, and the military.",
  "Renowned for my visionary approach, I excel in overseeing fiscal responsibilities, optimizing operations, and spearheading strategic initiatives that empower both startups and established organizations to achieve scalable, sustainable growth.",
  "As a trusted advisor to boards and C-suite leaders, I craft strategic plans and governance frameworks aligned with organizational objectives, while fostering innovative, collaborative cultures that enhance operational success.",
] as const;

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <main className="min-h-svh bg-neutral-50 px-4 pb-10 pt-24 text-neutral-950 transition-colors dark:bg-neutral-950 dark:text-white sm:px-6 sm:pt-28">
      <PortfolioHeader mode="public" />

      <section className="mx-auto max-w-6xl py-10">
        <FeatureVideoCard
          videoFit="cover"
          kicker="Dale Waugh"
          paragraphs={introParagraphs}
          title="Introduction"
          videoSrc="/videos/dale-waugh-intro.webm"
        />
      </section>
    </main>
  );
}
