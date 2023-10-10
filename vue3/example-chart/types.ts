import type { Ref } from 'vue';
import type { Nullable } from '#/types';

export interface PieChartInstance {
  mainChart: Ref<Nullable<HTMLElement>>;
  activeChart: Ref<Nullable<HTMLElement>>;
}

export type TPieChartDimensionProp = Nullable<string | number>;

export type PieChartDataItem = {
  value: number;
  name: string;
};

export interface PieChartData {
  title?: string;
  pieRadius?: Array<string | number>;
  color?: string[];
  data: PieChartDataItem[];
  currency?: string;
  position?: {
    top: string;
    left: string;
  };
}

export interface PieChartProps {
  width: TPieChartDimensionProp;
  height: TPieChartDimensionProp;
  chartData: PieChartData;
}
