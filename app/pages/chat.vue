<template>
  <div class="h-dvh flex flex-col">
    <AppHeader hide-clear />
    <div class="flex-1 overflow-hidden">
      <ChatPanel />
    </div>
  </div>
</template>

<script setup lang="ts">
const { loggedIn } = useUserSession();

definePageMeta({
  middleware: 'auth',
});

watchEffect(() => {
  if (!loggedIn.value) {
    navigateTo('/');
  }
});
</script>
