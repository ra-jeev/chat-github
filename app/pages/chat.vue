<template>
  <div class="h-screen flex flex-col">
    <AppHeader hide-clear />
    <UContainer class="flex-1 w-full py-4">
      <ChatPanel />
    </UContainer>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
});
</script>
