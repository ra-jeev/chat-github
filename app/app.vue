<template>
  <NuxtRouteAnnouncer />
  <NuxtLoadingIndicator />
  <NuxtPage />
</template>

<script setup lang="ts">
const { loggedIn } = useUserSession();
useHead({
  bodyAttrs: {
    class: 'bg-white dark:bg-gray-900',
  },
});

watchEffect(() => {
  if (!loggedIn.value) {
    navigateTo('/');
  }
});
</script>
