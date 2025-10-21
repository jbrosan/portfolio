<script setup lang="ts">
const colorMode = useColorMode();

// Handle color mode toggle with view transition
function toggleColorMode(event: MouseEvent) {
  console.log("Button clicked!");
  console.log("startViewTransition available:", !!document.startViewTransition);

  if (!document.startViewTransition) {
    // Fallback for browsers without View Transitions API
    return; // Let UColorModeButton handle it normally
  }

  // Prevent default behavior and stop event propagation
  event.preventDefault();
  event.stopPropagation();

  // Get click position
  const x = event.clientX;
  const y = event.clientY;

  console.log("Click position:", x, y);

  // Calculate the radius needed to cover the whole viewport
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  );

  console.log("End radius:", endRadius);

  // Set CSS variables for the animation
  document.documentElement.style.setProperty("--circle-x", `${x}px`);
  document.documentElement.style.setProperty("--circle-y", `${y}px`);
  document.documentElement.style.setProperty("--circle-radius", `${endRadius}px`);

  const newMode = colorMode.value === "dark" ? "light" : "dark";

  console.log("Starting transition to:", newMode);

  // Start the view transition
  document.startViewTransition(() => {
    console.log("Inside transition callback");
    colorMode.preference = newMode;
  });
}
</script>

<template>
  <UColorModeButton
    size="sm"
    class="rounded-full"
    @click="toggleColorMode"
  />
</template>
