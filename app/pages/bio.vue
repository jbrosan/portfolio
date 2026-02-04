<script lang="ts" setup>
import auth from "@/middleware/auth"
definePageMeta({ layout: "default", title: "Account Settings", middleware:[auth] });
</script>

<template>
  <div>
    <h1>Bio Page</h1>
    <p>This is the bio page content.</p>
  </div>
</template>

<style>

</style>
