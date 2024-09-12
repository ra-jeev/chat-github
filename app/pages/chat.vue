<template>
  <UContainer class="h-screen flex flex-col">
    <ChatPanel />
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
});
</script>
