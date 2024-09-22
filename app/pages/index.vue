<template>
  <div class="h-screen flex flex-col">
    <AppHeader />

    <main
      class="flex-grow flex flex-col justify-center items-center bg-gradient-to-t from-primary-500/20"
    >
      <div class="max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6">
          GitHub Search With <br />
          <span class="text-primary">Chat Interface</span>
        </h1>
        <p class="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-16">
          No more haggling with creating the correct query parameters. Just ype
          in the chat what you're looking for in natural language.
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

          <div v-else class="flex items-center justify-center gap-x-4">
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
      </div>
    </main>

    <AppFooter />
  </div>
</template>
