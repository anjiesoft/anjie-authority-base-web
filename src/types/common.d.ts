/**
 * 弹窗类型
 */
export interface Dialog {
  title: string;
  visible: boolean;
}

/**
 * 通用组件选择项类型
 */
export interface Option {
  value: number;
  label: string;
  checked?: boolean;
  children?: Option[];
}
