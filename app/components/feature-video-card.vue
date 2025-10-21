<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

type TextAlign = "left" | "center" | "right" | "justify";

type Props = {
  title: string;
  kicker?: string;
  body?: string;
  videoSrc?: string;
  poster?: string;
  iframeSrc?: string;
  mediaSide?: "left" | "right";
  controls?: boolean;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  /** 💡 New: choose how text is aligned */
  align?: TextAlign;
};

const props = withDefaults(defineProps<Props>(), {
  mediaSide: "right",
  controls: true,
  autoplay: false,
  loop: false,
  muted: true,
  align: "justify", // default
});

/* ---- Refs ---- */
const videoRef = ref<HTMLVideoElement | null>(null);
const isPlaying = ref(false);

/* ---- Toggle Play/Pause ---- */
function togglePlayback() {
  const vid = videoRef.value;
  if (!vid)
    return;

  if (vid.paused)
    vid.play().catch(() => {});
  else vid.pause();
}

/* ---- Keep state synced with native events ---- */
onMounted(() => {
  const vid = videoRef.value;
  if (!vid)
    return;

  const handlePlay = () => (isPlaying.value = true);
  const handlePause = () => (isPlaying.value = false);

  vid.addEventListener("play", handlePlay);
  vid.addEventListener("pause", handlePause);
  vid.addEventListener("ended", handlePause);

  onBeforeUnmount(() => {
    vid.removeEventListener("play", handlePlay);
    vid.removeEventListener("pause", handlePause);
    vid.removeEventListener("ended", handlePause);
  });
});
</script>

<template>
  <UCard class="overflow-hidden border border-default/60 shadow-sm" :ui="{ body: 'p-0' }">
    <div
      class="grid gap-0 md:grid-cols-2"
      :class="props.mediaSide === 'left' ? 'md:[&>*:first-child]:order-1' : ''"
    >
      <!-- Text -->
      <section class="p-6 sm:p-8 flex flex-col justify-center">
        <p v-if="kicker" class="text-2xl uppercase tracking-wide text-muted-foreground mb-2">
          {{ kicker }}
        </p>
        <h2 class="text-xl sm:text-2xl font-semibold leading-tight">
          {{ title }}
        </h2>

        <!-- ✅ Rich text with configurable alignment -->
        <div
          v-if="body"
          class="prose prose-neutral dark:prose-invert max-w-none mt-3 leading-relaxed"
          :class="[
            props.align === 'justify'
              ? 'text-justify'
              : props.align === 'center'
                ? 'text-center'
                : props.align === 'right'
                  ? 'text-right'
                  : 'text-left',
          ]"
          v-html="body"
        />

        <div class="mt-6 flex gap-3">
          <UButton
            color="primary"
            :icon="isPlaying ? 'i-lucide-pause' : 'i-lucide-play'"
            @click="togglePlayback"
          >
            {{ isPlaying ? 'Pause' : 'Watch' }}
          </UButton>

          <UButton
            color="neutral"
            variant="ghost"
            icon="i-lucide-info"
          >
            Learn more
          </UButton>
        </div>
      </section>

      <!-- Media -->
      <section class="relative">
        <div class="aspect-video md:aspect-auto md:h-full">
          <video
            v-if="videoSrc && !iframeSrc"
            ref="videoRef"
            :src="videoSrc"
            :poster="poster"
            :controls="controls"
            :autoplay="autoplay"
            :loop="loop"
            :muted="muted"
            playsinline
            class="h-full w-full object-cover rounded-xl"
          />
          <iframe
            v-else-if="iframeSrc"
            :src="iframeSrc"
            title="Video"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
            class="h-full w-full border-0 rounded-xl"
          />
          <div
            v-else
            class="h-full w-full grid place-items-center bg-muted text-muted-foreground rounded-xl"
          >
            No video source provided
          </div>
        </div>
      </section>
    </div>
  </UCard>
</template>
