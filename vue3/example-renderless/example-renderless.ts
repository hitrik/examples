import { h, Suspense, defineComponent } from 'vue';
import type { ComponentPublicInstance, VNodeChild, CSSProperties } from 'vue';
import { useRoute } from 'vue-router';
import QContainer from '@/components/QContainer';

export type TGenericComponent = ReturnType<typeof defineComponent>;
type SkeletonProps = {
  rows?: number;
  styleRow?: CSSProperties;
  style?: CSSProperties;
  ignoreLimitContainer?: boolean;
};

const withSuspense = (
  Component: TGenericComponent,
  SuspenseComponent: TGenericComponent,
  skeletonProps?: SkeletonProps
): TGenericComponent => {
  
  return defineComponent({
    name: 'ComponentPublicSkeleton',
    components: {
      SuspenseComponent
    },

    setup(): (arg: ComponentPublicInstance) => VNodeChild {
      return (instance: ComponentPublicInstance) => {
        return h(Suspense, null, {
          fallback: () => {
            const route = useRoute();

            const { noLimitContainer = false, fullWidthComponent = false } =
              route.meta;

            const hasContainer =
              noLimitContainer &&
              !skeletonProps?.ignoreLimitContainer;

            const suspenseRender = h(SuspenseComponent, skeletonProps);

            return hasContainer
              ? h(QContainer, null, {
                  default: () => suspenseRender
                })
              : suspenseRender;
          },
          default: () => h(Component, instance.$attrs, instance.$slots)
        });
      };
    }
  });
};

export default withSuspense;
