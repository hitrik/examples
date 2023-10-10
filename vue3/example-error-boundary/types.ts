import type { Component, Ref, defineComponent, ComputedRef } from 'vue';
import type { Nullable } from '#/types';

export type TGenericComponent = ReturnType<typeof defineComponent>;

export interface ErrorBoundaryProps {
  fallBack?: TGenericComponent;
  noData: boolean;
  onError?: (e: Error, v: Nullable<Component>, i: string) => void;
  params?: Record<string, unknown>;
  stopPropagation?: boolean;
}

export interface ErrorBoundaryInstance {
  fallbackComponent: ComputedRef<TGenericComponent>;
  error: Ref<Nullable<Error>>;
  info: Ref<string>;
  hasError: Ref<boolean>;
}
