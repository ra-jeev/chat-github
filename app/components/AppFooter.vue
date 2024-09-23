<template>
  <footer>
    <UContainer class="flex justify-center items-center gap-x-4 h-14">
      <p>Made with ❤️ by Rajeev</p>
      <UDivider
        orientation="vertical"
        class="h-6"
        :ui="{
          border: { base: 'border-primary-300 dark:border-primary-600' },
        }"
      />
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
];
</script>
