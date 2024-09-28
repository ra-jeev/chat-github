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
        <div class="flex items-center gap-x-2">
          <UIcon
            name="i-heroicons-light-bulb"
            class="text-primary-600 dark:text-primary-300 w-5 h-5"
          />
          <p class="text-gray-700 dark:text-gray-200">{{ suggestion }}</p>
        </div>
      </UCard>
    </div>

    <UCard
      :ui="{
        background: 'bg-gray-100/50 dark:bg-gray-800/50',
      }"
      class="mt-4"
    >
      <div class="space-y-2 text-gray-500 dark:text-gray-400">
        <h2 class="text-lg font-medium">Points to note:</h2>
        <ul class="list-disc pl-4 space-y-2">
          <li v-for="(point, index) in importantPoints" :key="index">
            {{ point }}
          </li>
        </ul>
      </div>
    </UCard>
  </div>
</template>

<script setup>
defineEmits(['query-select']);

const { user } = useUserSession();

const suggestions = [
  'Find my first pull request.',
  'How many repositories do I have?',
  'What was my first commit?',
  'Find my most starred repository.',
];

const importantPoints = [
  'This tool only fetches publicly available information from GitHub.',
  'For best results, use GitHub usernames when querying about other users.',
  'Use exact dates / time range for queries involving time (e.g., prefer 2024 over last year).',
  `It may not always find what you're looking for and occasional mistakes may occur.`,
  'Only queries about other users and failed queries are saved anonymously.',
];

const timeOfDay = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Morning';
  if (hour < 18) return 'Afternoon';
  return 'Evening';
});
</script>
