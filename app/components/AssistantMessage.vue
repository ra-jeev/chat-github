<template>
  <MDCRenderer
    v-if="ast"
    class="flex-1 prose dark:prose-invert"
    :body="ast.body"
  />
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
