<template>
  <div class="min-h-screen">
    <AppHeader />
    <div
      class="flex flex-col items-center gap-y-6 py-12 w-full max-w-xl mx-auto"
    >
      <h1 class="text-xl lg:text-2xl">Welcome to Chat GitHub</h1>

      <div>
        <AuthState v-slot="{ user, loggedIn, clear }">
          <div v-if="loggedIn" class="space-y-12 text-center">
            <h2>
              Logged in as {{ user?.login }}
              <UButton class="ml-2" color="black" @click="clear">
                Logout
              </UButton>
            </h2>

            <UButton size="lg" to="/chat"> Start Chatting </UButton>
          </div>
          <div v-else class="space-y-6">
            <h2>Sign in to chat with GitHub</h2>
            <UButton
              size="lg"
              icon="i-simple-icons-github"
              to="/auth/github"
              external
            >
              Sign In With GitHub
            </UButton>
          </div>
        </AuthState>
      </div>
    </div>
  </div>
</template>
