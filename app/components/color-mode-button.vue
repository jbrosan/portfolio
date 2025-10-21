<script setup lang="ts">
import { UButton } from "#components";

const colorMode = useColorMode();

function toggleColorMode(e: MouseEvent | PointerEvent | KeyboardEvent) {
  if (import.meta.server)
    return;

  // Flip immediately if user prefers reduced motion
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
    return;
  }

  // Safely detect support (don’t detach the method)
  const hasVT = typeof (document as any).startViewTransition === "function";

  // Determine click position; fall back to center for keyboard triggers
  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  if ("clientX" in e && typeof e.clientX === "number") {
    x = e.clientX;
    y = e.clientY;
  }

  const next = colorMode.value === "dark" ? "light" : "dark";

  if (!hasVT) {
    // No View Transitions support → just toggle
    colorMode.preference = next;
    return;
  }

  // Compute circle radius
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  );

  // Set CSS vars for the keyframes
  const root = document.documentElement;
  root.style.setProperty("--circle-x", `${x}px`);
  root.style.setProperty("--circle-y", `${y}px`);
  root.style.setProperty("--circle-radius", `${endRadius}px`)

  // IMPORTANT: call with `document` bound
  ;(document as any).startViewTransition.call(document, () => {
    colorMode.preference = next;
  });
}
</script>

<template>
  <ClientOnly>
    <UButton
      size="sm"
      color="neutral"
      variant="ghost"
      :icon="colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'"
      aria-label="Toggle color mode"
      :aria-pressed="colorMode.value === 'dark'"
      class="rounded-full"
      @click="toggleColorMode"
      @keyup.enter="toggleColorMode"
      @keyup.space.prevent="toggleColorMode"
    />
  </ClientOnly>
</template>
