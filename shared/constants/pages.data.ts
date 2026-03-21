import {
  PiBookDuotone,
  PiFileDuotone,
  PiHouseDuotone,
  PiSquaresFourDuotone,
} from "react-icons/pi";
import { IPageGroup } from "../types/components.type";

export const PAGE_GROUPS: IPageGroup[] = [
  {
    id: "main",
    name: "Main",
    pages: [
      {
        active: true,
        icon: PiHouseDuotone,
        name: "Home",
        path: "/",
      },
      {
        active: true,
        icon: PiSquaresFourDuotone,
        name: "Dashboard",
        path: "/dashboard",
      },
    ],
  },
  {
    id: "workspace",
    name: "Workspace",
    pages: [
      {
        active: true,
        icon: PiBookDuotone,
        name: "Projets",
        path: "/projects",
      },
      {
        active: true,
        icon: PiFileDuotone,
        name: "Notes",
        path: "/notes",
      },
    ],
  },
];
