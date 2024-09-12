<template>
  <div class="flex flex-col h-full">
    <div ref="chatContainer" class="flex-1 overflow-y-auto">
      <div
        class="max-w-4xl mx-auto border-x border-gray-200 dark:border-gray-800 p-4 space-y-5"
      >
        <div
          v-for="message in messages"
          :key="message.id"
          :class="[
            'flex items-start gap-x-4 p-4 rounded-lg',
            message.role === 'assistant' && 'bg-gray-50/60 dark:bg-gray-800/60',
          ]"
        >
          <div
            class="w-12 h-12 p-2 rounded-full"
            :class="`${
              message.role === 'user' ? 'bg-primary/20' : 'bg-blue-500/20'
            }`"
          >
            <UIcon
              :name="`${
                message.role === 'user'
                  ? 'i-heroicons-user-16-solid'
                  : 'i-heroicons-sparkles-solid'
              }`"
              class="w-8 h-8"
              :class="`${
                message.role === 'user' ? 'text-primary-400' : 'text-blue-400'
              }`"
            />
          </div>
          <div v-if="message.role === 'user'">
            {{ message.content }}
          </div>
          <MDC
            v-else
            :value="message.content"
            class="flex-1 prose dark:prose-invert"
          />
        </div>
        <ChatLoadingSkeleton v-if="loading" />
      </div>
    </div>
    <UDivider />
    <div class="flex items-start p-3.5 relative w-full max-w-4xl mx-auto">
      <UTextarea
        v-model="userMessage"
        placeholder="How can I help you today?"
        class="w-full"
        :ui="{
          padding: { xl: 'pr-11' },
          base: '!ring-primary-500 dark:!ring-primary-400',
        }"
        :rows="1"
        :maxrows="5"
        :disabled="loading"
        autoresize
        size="xl"
        @keydown.enter.exact.prevent="sendMessage"
        @keydown.enter.shift.exact.prevent="userMessage += '\n'"
      />

      <UButton
        icon="i-heroicons-arrow-up-20-solid"
        class="absolute top-5 right-5"
        :disabled="loading"
        @click="sendMessage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
type Message = {
  id?: string;
  role: string;
  content: string;
};

const messages = ref<Message[]>([]);
const loading = ref(false);
const userMessage = ref('');
const chatContainer = ref<HTMLElement | null>(null);
let observer: MutationObserver | null = null;

onMounted(() => {
  if (chatContainer.value) {
    observer = new MutationObserver(() => {
      if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
      }
    });

    observer.observe(chatContainer.value, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});

const sendMessage = async () => {
  if (!userMessage.value.trim()) return;

  loading.value = true;
  const tmpMessage = userMessage.value;
  try {
    userMessage.value = '';
    messages.value.push({
      role: 'user',
      id: String(Date.now()),
      content: tmpMessage,
    });
    const res = await $fetch('/api/chat', {
      method: 'POST',
      body: {
        messages: messages.value,
      },
    });

    if (res) {
      messages.value.push({
        role: 'assistant',
        id: String(Date.now()),
        content: res,
      });
    } else {
      messages.value.pop();
      userMessage.value = tmpMessage;
    }
  } catch (error) {
    console.error(error);
    messages.value.pop();
    userMessage.value = tmpMessage;
  }

  loading.value = false;
};
</script>
