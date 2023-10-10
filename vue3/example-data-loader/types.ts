import type { Ref } from 'vue';
import type { Nullable } from '#/types';

export interface DataLoaderInstance {
  execute: () => void;
  response: Ref<unknown>;
  error: Ref<Nullable<Error>>;
  isLoading: Ref<Nullable<boolean>>;
}