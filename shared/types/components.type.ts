export type TInputValue = number | string;

export interface IOption {
  label: string;
  leftContent?: React.ReactNode;
  value: TInputValue;
}
