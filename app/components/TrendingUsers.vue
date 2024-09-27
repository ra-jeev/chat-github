<template>
  <ul>
    <li
      v-for="user in trendingUsers"
      :key="user.username"
      class="rounded hover:bg-white/80 dark:hover:bg-gray-900/80"
    >
      <ULink
        class="flex items-center px-3.5 py-2.5 gap-x-3"
        target="_blank"
        :to="`https://github.com/${user.username}`"
      >
        <UAvatar :src="user.avatar_url" :alt="user.username" size="sm" />
        <div class="flex-grow">
          <div class="flex justify-between items-baseline">
            <p class="text-sm font-medium">
              {{ user.username }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ user.search_count }} times
            </p>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            Last searched {{ formatTime(user.last_searched) }}
          </p>
        </div>
      </ULink>
    </li>
  </ul>
</template>

<script setup lang="ts">
const { data: trendingUsers } = await useFetch('/api/trending-users');
</script>
