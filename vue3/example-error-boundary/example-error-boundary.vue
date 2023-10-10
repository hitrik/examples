<template>
  <template v-if="!$slots.boundary">
    <slot v-if="!hasError" />
    <component
      :is="fallbackComponent"
      v-else
      :error="error"
      :info="info"
      v-bind="params"
    />
  </template>
  <slot
    v-else
    name="boundary"
    :has-error="hasError"
    :error="error"
    :info="info"
    v-bind="params"
  />
</template>

<script lang="ts">
import {
  Component,
  computed,
  defineComponent,
  onErrorCaptured,
  PropType,
  ref
} from 'vue';
import DefaultFallback from './components/DefaultFallback';
import PlaceholderNoData from '../PlaceholderNoData';

import type {
  ErrorBoundaryProps,
  ErrorBoundaryInstance,
  TGenericComponent
} from '@/components/ErrorBoundary/types';
import type { Nullable } from '#/types';

const ERROR_CAPTURED_EVENT = 'error-captured';

export default defineComponent({
  name: 'ErrorBoundary',

  components: {
    DefaultFallback,
    PlaceholderNoData
  },

  props: {
    fallBack: {
      type: Object as PropType<string | TGenericComponent>,
      default: DefaultFallback
    },
    noData: {
      type: Boolean,
      default: false
    },
    onError: {
      type: Function as PropType<
        (e: Error, v: Nullable<Component>, i: string) => void
      >,
      default: () => {}
    },
    params: {
      type: Object,
      default: () => ({})
    },
    stopPropagation: {
      type: Boolean,
      default: true
    }
  },

  emits: [ERROR_CAPTURED_EVENT],

  setup(props: ErrorBoundaryProps, ctx): ErrorBoundaryInstance {
    const { slots, emit } = ctx;

    const hasError = ref<boolean>(false);
    const errorData = ref<Nullable<Error>>(null);
    const infoData = ref<string>('');

    const fallbackComponent = computed<TGenericComponent>(() =>
      props.noData ? PlaceholderNoData : DefaultFallback
    );

    if (!slots.default && !slots.boundary) {
      // eslint-disable-next-line no-console
      console.warn('ErrorBoundary component must have child components.');
    }

    onErrorCaptured((error: Error, vm: Nullable<Component>, info: string) => {
      const { onError, stopPropagation } = props;

      hasError.value = true;
      errorData.value = error;
      infoData.value = info;

      onError?.(error, vm, info);
      emit(ERROR_CAPTURED_EVENT, { error, vm, info });

      return !stopPropagation;
    });

    return {
      fallbackComponent,
      error: errorData,
      info: infoData,
      hasError
    };
  }
});
</script>
