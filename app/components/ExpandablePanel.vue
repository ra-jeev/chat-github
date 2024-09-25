<template>
  <div
    :class="{ 'w-full max-w-80 h-64 overflow-hidden': expanded }"
    class="flex flex-col bg-white/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg transition-all"
  >
    <div
      class="px-3.5 py-2.5 cursor-pointer bg-primary/50 rounded-t-lg"
      :class="{ 'rounded-b-lg': !expanded }"
      @click="expanded = !expanded"
    >
      <h3
        class="flex items-center justify-between text-lg font-semibold gap-x-4"
      >
        <div class="flex items-center gap-x-2">
          <UIcon
            :name="titleIcon"
            class="w-5 h-5 text-primary dark:text-primary-400"
          />
          {{ title }}
        </div>
        <UButton
          color="black"
          variant="ghost"
          :padded="false"
          :icon="expandIcon"
        />
      </h3>
    </div>
    <div v-if="expanded" class="flex-grow p-3.5 overflow-auto">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const expanded = ref(false);

const props = defineProps<{
  title: string;
  titleIcon: string;
  expandDirection: 'left' | 'right';
}>();

const expandIcon = computed(() => {
  /* eslint-disable @stylistic/operator-linebreak */
  if (props.expandDirection === 'left') {
    return expanded.value
      ? 'i-heroicons-arrow-down-right-20-solid'
      : 'i-heroicons-arrow-up-left-20-solid';
  }

  return expanded.value
    ? 'i-heroicons-arrow-down-left-20-solid'
    : 'i-heroicons-arrow-up-right-20-solid';
  /* eslint-enable @stylistic/operator-linebreak */
});
</script>
