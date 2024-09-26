<template>
  <ul>
    <li
      v-for="query in recentQueries"
      :key="query.id"
      class="px-3.5 py-2.5 rounded hover:bg-white/80 dark:hover:bg-gray-900/80"
    >
      <p class="text-sm font-medium">{{ query.text }}</p>
      <MDC
        class="text-sm text-gray-500 dark:text-gray-400 prose dark:prose-invert line-clamp-3"
        :value="query.response"
      />

      <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
        {{ formatTime(query.queried_at) }}
      </p>
    </li>
  </ul>
</template>

<script setup lang="ts">
const { data: recentQueries } = await useFetch('/api/recent-queries');
</script>
