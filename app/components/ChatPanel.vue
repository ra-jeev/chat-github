<template>
  <div class="flex flex-col h-full">
    <div ref="chatContainer" class="flex-1 overflow-y-auto">
      <div
        class="max-w-4xl mx-auto min-h-full border-x border-gray-200 dark:border-gray-800 p-4 space-y-2"
        :class="{
          'flex items-center justify-center': messages.length === 0,
        }"
      >
        <template v-for="message in messages" :key="message.id">
          <UserMessage
            v-if="message.role === 'user'"
            :content="message.content"
          />

          <AssistantMessage
            v-else
            :content="message.content"
            :message-id="message.id"
          />
        </template>
        <ChatLoadingSkeleton v-if="loading" class="p-4" />
        <NoChats v-if="messages.length === 0" @query-select="onQuerySelect" />
      </div>
    </div>
    <UDivider />
    <div class="flex items-start p-3.5 relative w-full max-w-4xl mx-auto">
      <UTextarea
        ref="userInput"
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
import type { Message } from '~~/types';

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

const onQuerySelect = (query: string) => {
  userMessage.value = query;
  sendMessage();
};

const toast = useToast();
const userInput = useTemplateRef('userInput');

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

    const response = useChat('/api/chat', { messages: messages.value })();

    let responseAdded = false;
    for await (const chunk of response) {
      if (responseAdded) {
        // add the chunk to the current message's content
        messages.value[messages.value.length - 1]!.content += chunk;
      } else {
        // add a new message to the chat history
        messages.value.push({
          role: 'assistant',
          id: String(Date.now()),
          content: chunk,
        });

        responseAdded = true;
        loading.value = false;
      }
    }

    nextTick(() => {
      userInput.value?.textarea.focus();
    });
  } catch (error) {
    console.error(error);
    messages.value.pop();
    userMessage.value = tmpMessage;
    loading.value = false;

    toast.add({
      title: 'Request Error',
      description: 'Failed to generate a response, please try again.',
      timeout: 10000,
      icon: 'i-heroicons-exclamation-triangle-16-solid',
      color: 'red',
    });
  }
};
</script>
