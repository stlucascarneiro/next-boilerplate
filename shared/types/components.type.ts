import { IconType } from "react-icons";

export type TInputValue = number | string;

export interface IOption {
  label: string;
  leftContent?: React.ReactNode;
  value: TInputValue;
}

export interface IPageGroup {
  id: string;
  name: string;
  pages: IPage[];
}

export interface IPage {
  active: boolean;
  dynamicPages?: string[];
  icon?: IconType;
  name: string;
  path: string;
  subpages?: {
    name: string;
    path: string;
  }[];
}
