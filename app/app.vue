<template>
  <NuxtRouteAnnouncer />
  <NuxtLoadingIndicator />
  <NuxtPage />
  <UNotifications />
</template>

<script setup lang="ts">
useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  ],
  bodyAttrs: {
    class: 'bg-white dark:bg-gray-900',
  },
  link: [
    { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
    {
      rel: 'icon',
      href: '/favicon.svg',
      sizes: 'any',
      type: 'image/svg+xml',
    },
  ],
});

useSeoMeta({
  title: 'Chat GitHub',
  ogTitle: 'Chat GitHub - Search GitHub in Plain English',
  description:
    'Chat GitHub is an AI powered chat interface that lets you search GitHub in everyday language. No need to remember complex query syntax.',
  ogImage: 'https://chat-github.nuxt.dev/home.png',
  twitterCard: 'summary_large_image',
});
</script>
