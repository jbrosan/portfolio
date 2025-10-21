// composables/usePalette.ts
export function usePalette() {
  const key = "app:palette";
  const palette = useState<"ocean" | "midnight" | "slate">("palette", () => "ocean");

  if (import.meta.client) {
    const saved = localStorage.getItem(key) as typeof palette.value | null;
    if (saved)
      palette.value = saved;
    document.documentElement.dataset.palette = palette.value;
  }

  function setPalette(next: typeof palette.value) {
    palette.value = next;
    if (import.meta.client) {
      document.documentElement.dataset.palette = next;
      localStorage.setItem(key, next);
    }
  }
  return { palette, setPalette };
}
