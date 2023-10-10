<template>
  <template v-if="isLoading">
    <slot name="skeleton"></slot>
  </template>
  <template v-else-if="error">
    <slot
      name="error"
      v-bind="{ error }"
    ></slot>
  </template>
  <template v-else>
    <slot v-bind="{ response, execute, error, isLoading }"></slot>
  </template>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { useToggle } from '@vueuse/core';

import type { Nullable } from '#/types';
import type { DataLoaderInstance } from './types';

export default defineComponent({
  name: 'DataLoader',

  props: {
    request: {
      type: Function,
      required: true
    }
  },

  setup(props): DataLoaderInstance {
    const response = ref<Nullable<unknown>>(null);
    const error = ref<Nullable<Error>>(null);
    const isLoading = ref<Nullable<boolean>>(false);

    const [trigger, triggerRequest] = useToggle();

    watch(trigger, async () => {
      error.value = null;
      isLoading.value = true;

      try {
        response.value = await props.request();
      } catch (exception) {
        error.value = exception as Error;
      } finally {
        isLoading.value = false;
      }
    });

    return {
      execute: triggerRequest,
      response,
      error,
      isLoading
    };
  }
});
</script>
