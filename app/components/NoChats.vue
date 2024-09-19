<template>
  <div class="flex flex-col justify-center">
    <div class="text-center mb-12">
      <h1
        class="text-2xl md:text-3xl lg:text-5xl text-gray-600 dark:text-gray-300 text-center mb-4"
      >
        Good {{ timeOfDay }}, {{ user.login }}
      </h1>

      <p class="text-gray-500 dark:text-gray-400">
        Here are some things you can try...
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <UCard
        v-for="(suggestion, index) in suggestions"
        :key="`suggestion-${index}`"
        class="transition-colors cursor-pointer"
        :ui="{
          background:
            'bg-gray-100/50 hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-800',
        }"
        @click="$emit('query-select', suggestion)"
      >
        <div class="flex items-center">
          <UIcon
            name="i-heroicons-information-circle"
            class="text-primary-600 dark:text-primary-300 w-5 h-5 mr-2"
          />
          <p class="text-gray-700 dark:text-gray-200">{{ suggestion }}</p>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup>
defineEmits(['query-select']);

const { user } = useUserSession();

const suggestions = [
  'Find my first pull request',
  'Show my last 5 commits',
  'What was my first commit?',
  'Find my most starred repository',
];

const timeOfDay = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Morning';
  if (hour < 18) return 'Afternoon';
  return 'Evening';
});
</script>
