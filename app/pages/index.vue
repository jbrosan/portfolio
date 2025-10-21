<script setup lang="ts">
definePageMeta({ layout: "default" });

const introHtml = `
  <p>I am a seasoned executive with over 15 years of leadership experience,
  driving transformative change across industries such as manufacturing,
  oil and gas, real estate, retail, and the military.</p>
  <br>

  <p>Renowned for my visionary approach, I excel in overseeing fiscal responsibilities,
  optimizing operations, and spearheading strategic initiatives that empower both
  startups and established organizations to achieve scalable, sustainable growth.</p>
  <br>
  <p>As a trusted advisor to boards and C-suite leaders, I craft strategic plans and
  governance frameworks aligned with organizational objectives, while fostering
  innovative, collaborative cultures that enhance operational success.</p>
`;
</script>

<template>
  <div class="py-10 space-y-10">
    <FeatureVideoCard
      class="rounded-2xl"
      align="left"
      media-side="right"
      kicker="Dale Waugh"
      title="Introduction"
      :body="introHtml"
      video-src="/videos/dale-waugh-intro.webm"
      :autoplay="true"
      :loop="false"
      :controls="false"
      :muted="false"
    />
  </div>
</template>
