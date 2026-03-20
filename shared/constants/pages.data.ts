import {
  PiIdentificationCardDuotone,
  PiUserCircleGearDuotone,
} from "react-icons/pi";

export const PAGES = [
  {
    active: true,
    icon: null,
    name: "auth",
    path: "/auth",
    protected: false,
    subpages: [
      {
        name: "signin",
        path: "/auth/signin",
      },
    ],
  },
  {
    active: true,
    dynamicPages: ["/characters/:sheetId/"],
    icon: PiIdentificationCardDuotone,
    name: "characters",
    path: "/characters",
    protected: true,
    subpages: [
      {
        name: "attributes",
      },
      {
        name: "background",
      },
    ],
  },
  {
    active: false,
    icon: PiUserCircleGearDuotone,
    name: "account",
    path: "/account",
    protected: true,
    subpages: [],
    system: true,
  },
];
