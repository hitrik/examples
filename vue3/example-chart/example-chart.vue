<template>
  <div class="chart">
    <div class="chart__main">
      <div
        ref="mainChart"
        class="chart__dom_main"
      />
      <div
        ref="activeChart"
        class="chart__dom_active"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { init, use } from 'echarts/core';
import type { EChartsOption, EChartsType } from 'echarts';

import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import { TooltipComponent } from 'echarts/components';

import {
  ref,
  defineComponent,
  onMounted,
  onBeforeUnmount,
  computed,
  watch,
  shallowRef
} from 'vue';
import type { PropType } from 'vue';
import { createChartOption } from './helpers';

import type { Nullable } from '#/types';
import type {
  PieChartInstance,
  PieChartProps,
  PieChartData,
  TPieChartDimensionProp
} from './types';

use([CanvasRenderer, PieChart, TooltipComponent]);

const COLOR_TRANSPARENT = 'transparent';
const PIE_RADIUS = ['0%', '94%'];
const ACTIVE_INDEX_EVENT = 'active';

export default defineComponent({
  name: 'PieChart',

  props: {
    width: {
      type: [Number, String],
      default: 180
    },
    height: {
      type: [Number, String],
      default: 180
    },
    chartData: {
      type: Object as PropType<PieChartData>,
      default: null
    }
  },

  emits: [ACTIVE_INDEX_EVENT],

  setup(props: PieChartProps, ctx): PieChartInstance {
    const width = ref<TPieChartDimensionProp>(props.width);
    const height = ref<TPieChartDimensionProp>(props.height);

    const mainChart = shallowRef<Nullable<HTMLElement>>(null);
    const activeChart = shallowRef<Nullable<HTMLElement>>(null);
    const chartOption = shallowRef<EChartsOption>(
      createChartOption(props.chartData)
    );
    const currentIndex = ref<Nullable<number>>(null);

    let mainChartInstance: EChartsType;
    let activeChartInstance: EChartsType;

    const activeData = computed(() => {
      const { data, color, currency } = props.chartData;
      const overlayColors = new Array(data.length).fill(COLOR_TRANSPARENT);
      const chartData = createChartOption({
        data,
        color,
        currency,
        pieRadius: PIE_RADIUS
      });
      const [option] = chartData.series as Array<Record<string, string[]>>;

      if (currentIndex.value !== null && option) {
        overlayColors.splice(
          currentIndex.value,
          1,
          option.color?.[currentIndex.value]
        );
      }
      option.color = overlayColors;
      return chartData;
    });

    const initChart = (elem: HTMLElement): unknown => {
      return init(elem, undefined, {
        width: Number(width.value),
        height: Number(height.value)
      });
    };

    const mouseOverHandler = (params: { dataIndex: number }): void => {
      currentIndex.value = params.dataIndex;
    };

    const mouseOutHandler = (): void => {
      currentIndex.value = null;
    };

    const updateChart = (): void => {
      if (!mainChart.value || !activeChart.value) {
        return;
      }

      if (!mainChartInstance && !activeChartInstance) {
        mainChartInstance = initChart(mainChart.value) as EChartsType;
        activeChartInstance = initChart(activeChart.value) as EChartsType;
      }

      mainChartInstance.setOption(chartOption.value);
      activeChartInstance.setOption(activeData.value);
    };

    watch(currentIndex, index => {
      activeChartInstance.setOption(activeData.value);
      ctx.emit(ACTIVE_INDEX_EVENT, index);
    });

    watch(
      () => props.chartData,
      value => {
        chartOption.value = createChartOption(value);
        updateChart();
      }
    );

    onMounted(() => {
      updateChart();
      if (activeChartInstance) {
        activeChartInstance.on('mouseover', mouseOverHandler);
        activeChartInstance.on('mouseout', mouseOutHandler);
      }
    });

    onBeforeUnmount(() => {
      if (activeChartInstance) {
        activeChartInstance.off('mouseover', mouseOverHandler);
        activeChartInstance.off('mouseout', mouseOutHandler);
        activeChartInstance.dispose();
      }
      mainChartInstance?.dispose();
    });

    return {
      mainChart,
      activeChart
    };
  }
});
</script>

<style lang="scss" scoped>
.chart {
  width: v-bind(width);
  height: v-bind(height);

  &__main {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    &__tooltip {
      border-radius: var(--border-radius-base);
    }
  }

  &__dom {
    &_active {
      position: absolute;
    }
  }
}
</style>
