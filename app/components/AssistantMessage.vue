<template>
  <div
    class="flex items-start gap-x-4 p-4 rounded-lg bg-gray-50/60 dark:bg-gray-800/60"
  >
    <UIcon
      name="i-simple-icons-github"
      class="w-10 h-10 text-gray-700 dark:text-gray-300"
    />

    <MDCRenderer
      v-if="ast"
      class="flex-1 prose dark:prose-invert"
      :body="ast.body"
    />
  </div>
</template>

<script setup lang="ts">
import { parseMarkdown } from '#imports';

const props = defineProps<{
  content: string;
  messageId: string;
}>();

const { data: ast, refresh } = await useAsyncData(props.messageId, () =>
  parseMarkdown(props.content)
);

watch(
  () => props.content,
  () => {
    refresh();
  }
);
</script>
