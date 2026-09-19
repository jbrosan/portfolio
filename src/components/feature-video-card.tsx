import { Info, Pause, Play } from "lucide-react";
import { useRef, useState } from "react";

type FeatureVideoCardProps = {
  title: string;
  kicker?: string;
  paragraphs: readonly string[];
  videoSrc: string;
};

export function FeatureVideoCard({ title, kicker, paragraphs, videoSrc }: FeatureVideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  async function togglePlayback() {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    if (video.paused) {
      await video.play();
    } else {
      video.pause();
    }
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white/90 shadow-xl shadow-neutral-950/5 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/85 dark:shadow-black/25">
      <div className="grid md:grid-cols-2">
        <section className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
          {kicker ? (
            <p className="mb-2 text-xl font-medium uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400 sm:text-2xl">
              {kicker}
            </p>
          ) : null}

          <h1 className="text-2xl font-semibold tracking-tight text-neutral-950 dark:text-white sm:text-3xl">
            {title}
          </h1>

          <div className="mt-5 space-y-4 text-left text-[0.98rem] leading-7 text-neutral-700 dark:text-neutral-300">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              className="inline-flex items-center gap-2 rounded-lg bg-neutral-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
              onClick={togglePlayback}
              type="button"
            >
              {isPlaying ? (
                <Pause aria-hidden="true" size={17} />
              ) : (
                <Play aria-hidden="true" size={17} />
              )}
              {isPlaying ? "Pause" : "Watch"}
            </button>

            <button
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-900"
              type="button"
            >
              <Info aria-hidden="true" size={17} />
              Learn more
            </button>
          </div>
        </section>

        <section className="relative min-h-72 overflow-hidden bg-neutral-950 md:min-h-full">
          <video
            autoPlay
            className="h-full min-h-72 w-full object-cover md:absolute md:inset-0"
            loop={false}
            muted={false}
            onEnded={() => setIsPlaying(false)}
            onPause={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
            playsInline
            ref={videoRef}
            src={videoSrc}
          />
        </section>
      </div>
    </article>
  );
}
