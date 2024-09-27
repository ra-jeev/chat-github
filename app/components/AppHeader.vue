<template>
  <header
    class="bg-white/75 dark:bg-gray-900/75 backdrop-blur border-b -mb-px sticky top-0 z-50 border-gray-200 dark:border-gray-800"
  >
    <UContainer class="flex flex-wrap items-center justify-between h-14">
      <div class="flex items-center gap-x-4">
        <ULink
          class="text-xl md:text-2xl text-primary font-bold flex items-center gap-x-2"
          to="/"
        >
          <AppIcon class="w-8 h-8" /> Chat GitHub
        </ULink>
        <UTooltip v-if="!hideClear" text="Clear chat">
          <UButton
            color="gray"
            icon="i-heroicons-trash"
            @click="$emit('clear')"
          />
        </UTooltip>
      </div>
      <div class="flex items-center gap-x-4">
        <ColorMode />
        <UButton
          icon="i-simple-icons-github"
          color="gray"
          variant="ghost"
          to="https://github.com/ra-jeev/chat-github"
          target="_blank"
        />
        <UserMenu v-if="loggedIn" />
      </div>
    </UContainer>
  </header>
</template>

<script setup lang="ts">
const { loggedIn } = useUserSession();

defineEmits(['clear']);

defineProps({
  hideClear: {
    type: Boolean,
    default: true,
  },
});
</script>
