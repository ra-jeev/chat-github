<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-t from-primary-500/20">
    <AppHeader />

    <main class="flex-grow flex flex-col justify-center items-center relative">
      <div class="w-full max-w-3xl px-4 sm:px-6 lg:px-8 text-center py-12">
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6">
          <span class="text-primary">Search GitHub</span>
          <br />
          in Plain English
        </h1>
        <p class="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-12">
          Forget complex query syntax. Simply describe what you're looking for
          in everyday language, and let AI-powered search do the heavy lifting.
        </p>
        <AuthState v-slot="{ loggedIn }">
          <UButton
            v-if="loggedIn"
            size="lg"
            trailing-icon="i-heroicons-arrow-right-16-solid"
            to="/chat"
          >
            Go to Chat
          </UButton>

          <div v-else class="flex flex-col items-center justify-center gap-y-2">
            <UButton
              size="lg"
              icon="i-simple-icons-github"
              to="/auth/github"
              external
            >
              Sign in with GitHub
            </UButton>
            <p class="text-sm text-gray-600 dark:text-gray-300 text-center">
              Start Chatting Now!
            </p>
          </div>
        </AuthState>
        <div class="mt-12">
          <div
            class="inline-flex font-mono text-sm text-gray-600 dark:text-gray-300 p-4 border border-primary-200 dark:border-primary-800 bg-white/80 dark:bg-gray-900/80 rounded-lg"
          >
            Supports /issues, /commits, /users & /repositories
          </div>
        </div>
      </div>

      <div class="w-full px-1 sm:absolute inset-x-0 bottom-0">
        <UContainer
          class="flex justify-center sm:justify-between items-end min-h-20 sm:h-auto relative"
        >
          <ExpandablePanel
            ref="mostSearchedPanel"
            title="Most Searched"
            title-icon="i-heroicons-arrow-trending-up-16-solid"
            expand-direction="right"
            class="absolute bottom-12 sm:static"
          >
            <TrendingUsers />
          </ExpandablePanel>

          <ExpandablePanel
            ref="recentQueriesPanel"
            title="Recent Queries"
            title-icon="i-heroicons-clock-solid"
            expand-direction="left"
            max-expanded-width="max-w-96"
            expanded-height="h-72"
            class="absolute sm:static"
          >
            <RecentQueries />
          </ExpandablePanel>
        </UContainer>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
onMounted(() => {
  document.addEventListener('click', handleOutsideClick);
});

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick);
});

const mostSearchedPanel = useTemplateRef('mostSearchedPanel');
const recentQueriesPanel = useTemplateRef('recentQueriesPanel');
const handleOutsideClick = (event: MouseEvent) => {
  const clickedOutside = ![
    mostSearchedPanel.value?.$el,
    recentQueriesPanel.value?.$el,
  ].some((el) => el && el.contains(event.target));

  if (clickedOutside) {
    mostSearchedPanel.value?.close();
    recentQueriesPanel.value?.close();
  }
};
</script>
