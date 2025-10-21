export default defineNuxtPlugin(() => {
  const { palette } = usePalette();
  document.documentElement.dataset.palette = palette.value;
});
