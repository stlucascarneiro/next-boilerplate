"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { capitalizeFirstLetter } from "@/shared/services/utils";
import Button from "../../shared/Button.client";
import { PAGES } from "../../shared/constants/pages.data";
import Divider from "../../shared/Divider";
import { toggleNavbar } from "./services/toggleNavbar";

export default function Navbar() {
  const pathname = usePathname();
  const main = pathname.split("/")[1];

  const page = PAGES.find((page) => page.name === main);

  if (!page || !page?.protected) return null;

  return (
    <>
      <button
        className="absolute hidden h-full w-full bg-black/5 md:hidden"
        id="overlay"
        onClick={toggleNavbar}
      />
      <nav
        className="border-border-surface bg-surface absolute z-10 flex h-full w-full max-w-13.5 -translate-x-16 flex-col gap-3 border-r p-2 pt-4 delay-75 duration-300 hover:max-w-60 md:static md:translate-x-0"
        id="navbar"
      >
        {PAGES.map((pg, index) => {
          const Icon = pg.icon;
          const selected = main === pg.name;

          if (!pg.protected || !pg.active || pg.system) return null;

          return (
            <Link
              className="w-full overflow-hidden rounded-sm"
              href={pg.path}
              key={index}
            >
              <Button
                className="gap-2.5 px-2.5 py-2 text-sm"
                icon={!!Icon && <Icon className="text-lg" />}
                size="unstyled"
                variant={selected ? "primary" : "ghost"}
                width="full"
              >
                {capitalizeFirstLetter(pg.name)}
              </Button>
            </Link>
          );
        })}
        <Divider />
        {PAGES.map((pg, index) => {
          const Icon = pg.icon;

          if (!pg.active || !pg.system) return null;

          return (
            <Link className="w-full overflow-hidden" href={pg.path} key={index}>
              <Button
                className="gap-2.5 px-2.5 py-2 text-sm"
                icon={!!Icon && <Icon className="text-lg" />}
                size="unstyled"
                variant={
                  pathname === pg.path ||
                  pg.subpages?.some((sp) => sp.path === pathname)
                    ? "primary"
                    : "ghost"
                }
                width="full"
              >
                {capitalizeFirstLetter(pg.name)}
              </Button>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
