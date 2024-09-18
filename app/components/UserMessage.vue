<template>
  <div
    class="flex items-start gap-x-4 p-4 rounded-lg bg-primary-50/15 dark:bg-primary-800/15"
  >
    <UAvatar v-if="user && user.avatarUrl" :src="user.avatarUrl" size="lg" />
    <div v-else class="w-12 h-12 p-2 rounded-full bg-primary/25">
      <UIcon
        name="i-heroicons-user-16-solid"
        class="w-8 h-8 text-primary-500"
      />
    </div>

    {{ content }}
  </div>
</template>

<script setup lang="ts">
defineProps<{ content: string }>();

const { user } = useUserSession();
</script>
