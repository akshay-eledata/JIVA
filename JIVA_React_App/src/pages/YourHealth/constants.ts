import { YOUR_HEALTH_LABELS } from './labels';

export interface Biomarker {
  category: string;
  name: string;
  sublabel: string;
  valueLabel: string;
  statusLabel: string;
  statusColor: string;
  batch: string;
  qty: string;
  status: 'inRange' | 'outOfRange' | 'improving';
}

export interface ChartSeriesItem {
  name: string;
  data: number[];
}

export interface SummaryCardItem {
  id: 'inRange' | 'outOfRange' | 'improving';
  label: string;
  count: number;
  color: string;
  iconColor: string;
}

// Your Health Page Constants
export const YOUR_HEALTH_CONSTANTS = {
  MAX_WIDTH: '1300px',
  PADDING: '30px 16px',
  BG_COLOR: '#FFFFFF',
  TEXT_COLOR: '#1E293B',
  TEXT_SECONDARY: '#475569',
  
  CHART_OPACITY: 1,
  CHART_STROKE_WIDTH: 3,
  CHART_BAR_WIDTH: '8%',
  CHART_BAR_GAP: '30%',
  CHART_FONT_SIZE: '11px',
  CHART_FONT_WEIGHT: 600,
  CHART_MIN_Y: 0,
  CHART_MAX_Y: 400,
  CHART_TICK_AMOUNT: 4,
  
  COLORS: {
    PRIMARY_BLUE: '#2563EB',
    SECONDARY_SLATE: '#CBD5E1',
    BORDER_LIGHT: '#E4E7EC',
    TEXT_MUTED: '#98A2B3',
    TOOLTIP_BG: '#101828',
    TOOLTIP_TITLE: '#98A2B3',
    TOOLTIP_DOT_BLUE: '#3B82F6',
    TOOLTIP_DOT_TEAL: '#14B8A6',
    IN_RANGE: '#14B8A6',
    OUT_OF_RANGE_RED: '#F1696E',
    TEXT_DARK: '#1F2937',
    BANNER_BG: '#F6F8FB',
    BANNER_TEXT: '#001940',
    TAB_BORDER_ACTIVE: '#BBF7D0',
    TAB_BORDER_INACTIVE: '#EAECF0',
    TAB_BG_ACTIVE: '#D8FDE3',
    TAB_BG_HOVER_ACTIVE: '#D8FDE3',
    TAB_BG_HOVER_INACTIVE: '#F9FAFB',
    TAB_ICON_BG: '#F8F9FA',
    TAB_TEXT_INACTIVE: '#728197',
    TAB_COUNT_COLOR: '#1A212B',
    TABLE_BORDER: '#EAECF0',
    TABLE_HEADER_TEXT: '#1A212B',
    CATEGORY_HEADER_TEXT: '#1B1B1F',
    CATEGORY_COUNT_TEXT: '#728197',
    MINI_CHART_STROKE: '#9AA8BC',
    MINI_CHART_RECT_FILL: '#9AA8BC',
    MINI_CHART_RECT_BG: '#E2E8F0',
  },
  
  CHART_SERIES: [
    { name: YOUR_HEALTH_LABELS.IN_RANGE, data: [180, 280] },
    { name: YOUR_HEALTH_LABELS.OUT_OF_RANGE, data: [130, 120] }
  ] as ChartSeriesItem[],
  
  BIOMARKERS: [
    { category: 'Autoimmunity', name: 'Anti Nuclear Antibodies (ANA) Pattern', sublabel: YOUR_HEALTH_LABELS.APPROPRIATE_RANGE, valueLabel: "25 IU/ml", statusLabel: YOUR_HEALTH_LABELS.IN_RANGE, statusColor: "#CCFBF1", batch: "25 IU/ml", qty: YOUR_HEALTH_LABELS.IN_RANGE, status: 'inRange' },
    { category: 'Autoimmunity', name: 'Anti Nuclear Antibodies (ANA) Pattern', sublabel: YOUR_HEALTH_LABELS.LESS_THAN_TEN, valueLabel: "25 IU/ml", statusLabel: YOUR_HEALTH_LABELS.IN_RANGE, statusColor: "#CCFBF1", batch: "25 IU/ml", qty: YOUR_HEALTH_LABELS.IN_RANGE, status: 'inRange' },
    { category: 'Autoimmunity', name: 'Anti Nuclear Antibodies (ANA) Pattern', sublabel: YOUR_HEALTH_LABELS.LESS_THAN_TEN, valueLabel: "25 IU/ml", statusLabel: YOUR_HEALTH_LABELS.IN_RANGE, statusColor: "#CCFBF1", batch: "25 IU/ml", qty: YOUR_HEALTH_LABELS.IN_RANGE, status: 'inRange' },
    { category: 'Blood', name: 'Anti Nuclear Antibodies (ANA) Pattern', sublabel: YOUR_HEALTH_LABELS.APPROPRIATE_RANGE, valueLabel: "25 IU/ml", statusLabel: YOUR_HEALTH_LABELS.IN_RANGE, statusColor: "#CCFBF1", batch: "25 IU/ml", qty: YOUR_HEALTH_LABELS.IN_RANGE, status: 'inRange' },
    { category: 'Blood', name: 'Anti Nuclear Antibodies (ANA) Pattern', sublabel: YOUR_HEALTH_LABELS.LESS_THAN_TEN, valueLabel: "25 IU/ml", statusLabel: YOUR_HEALTH_LABELS.IN_RANGE, statusColor: "#CCFBF1", batch: "25 IU/ml", qty: YOUR_HEALTH_LABELS.IN_RANGE, status: 'inRange' },
    { category: 'Blood', name: 'Anti Nuclear Antibodies (ANA) Pattern', sublabel: YOUR_HEALTH_LABELS.LESS_THAN_TEN, valueLabel: "25 IU/ml", statusLabel: YOUR_HEALTH_LABELS.IN_RANGE, statusColor: "#CCFBF1", batch: "25 IU/ml", qty: YOUR_HEALTH_LABELS.IN_RANGE, status: 'inRange' },
  ] as Biomarker[],
  
  SUMMARY_CARDS: [
    { id: 'inRange', label: YOUR_HEALTH_LABELS.IN_RANGE, count: 18, color: '#D1FAE5', iconColor: '#10B981' },
    { id: 'outOfRange', label: YOUR_HEALTH_LABELS.OUT_OF_RANGE, count: 8, color: '#FEE2E2', iconColor: '#EF4444' },
    { id: 'improving', label: YOUR_HEALTH_LABELS.IMPROVING, count: 17, color: '#DBEAFE', iconColor: '#3B82F6' }
  ] as SummaryCardItem[]
};
