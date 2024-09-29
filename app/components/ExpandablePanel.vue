<template>
  <div
    :class="[
      expanded &&
        `w-full ${maxExpandedWidth} ${expandedHeight} overflow-hidden`,
      'flex flex-col bg-white/85 dark:bg-gray-900/85 sm:bg-white/70 sm:dark:bg-gray-900/70 rounded-lg shadow-lg transition-all',
    ]"
  >
    <div
      class="flex items-center justify-between sm:text-lg font-medium leading-none gap-x-3 px-3.5 py-2.5 cursor-pointer bg-primary/70 sm:bg-primary/60 rounded-t-lg"
      :class="{ 'rounded-b-lg': !expanded }"
      @click="expanded = !expanded"
    >
      <h3 class="flex items-center gap-x-2">
        <UIcon
          :name="titleIcon"
          class="w-5 h-5 text-primary-600 dark:text-primary-400 sm:text-primary sm:dark:text-primary shrink-0"
        />
        {{ title }}
      </h3>
      <UButton
        class="hidden sm:inline-block"
        color="black"
        variant="ghost"
        :padded="false"
        :icon="expandIcon"
      />
      <UButton
        class="sm:hidden"
        color="black"
        variant="ghost"
        :padded="false"
        :icon="
          expanded
            ? 'i-heroicons-arrow-down-20-solid'
            : 'i-heroicons-arrow-up-20-solid'
        "
      />
    </div>
    <div v-if="expanded" class="flex-grow overflow-auto">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const expanded = ref(false);

const props = withDefaults(
  defineProps<{
    title: string;
    titleIcon: string;
    expandDirection: 'left' | 'right';
    maxExpandedWidth?: string;
    expandedHeight?: string;
  }>(),
  {
    expandDirection: 'right',
    maxExpandedWidth: 'max-w-80',
    expandedHeight: 'h-64',
  }
);

const close = () => {
  expanded.value = false;
};

defineExpose({ close });

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
