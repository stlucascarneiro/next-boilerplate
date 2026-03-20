import { IconType } from "react-icons";

export type TInputValue = number | string;

export interface IOption {
  label: string;
  leftContent?: React.ReactNode;
  value: TInputValue;
}

export interface IPage {
  active: boolean;
  dynamicPages?: string[];
  icon?: IconType;
  name: string;
  path: string;
  protected: boolean;
  subpages?: {
    name: string;
    path: string;
  }[];
  system: boolean;
}
