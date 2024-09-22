<template>
  <footer class="border-t -mt-px border-gray-200 dark:border-gray-800">
    <UContainer class="flex justify-center items-center gap-x-4 h-14">
      <p>Made with ❤️ by Rajeev</p>
      <UDivider orientation="vertical" class="h-6" />
      <div class="flex gap-x-2 justify-center">
        <UButton
          v-for="social in socials"
          :key="social.name"
          :to="social.to"
          :icon="social.icon"
          :aria-label="social.name"
          color="gray"
          target="_blank"
          variant="ghost"
        />
      </div>
    </UContainer>
  </footer>
</template>

<script setup lang="ts">
const socials = [
  {
    name: 'x',
    icon: 'i-simple-icons-x',
    to: 'https://twitter.com/ra_jeeves',
  },
  {
    name: 'github',
    icon: 'i-simple-icons-github',
    to: 'https://github.com/ra-jeev',
  },
];
</script>
