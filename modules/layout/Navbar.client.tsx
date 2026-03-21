"use client";

import { usePathname } from "next/navigation";
import { PiGearSixDuotone } from "react-icons/pi";

import Avatar from "@/shared/Avatar";
import { capitalizeFirstLetter } from "@/shared/services/utils";
import { IPageGroup } from "@/shared/types/components.type";
import { PAGE_GROUPS } from "../../shared/constants/pages.data";
import NavItemButton from "./NavItemButton.client";
import { toggleNavbar } from "./services/toggleNavbar";

const PageGroup = ({
  pageGroup,
  pathname,
}: {
  pageGroup: IPageGroup;
  pathname: string;
}) => {
  const activePages = pageGroup.pages.filter((page) => page.active);

  if (activePages.length === 0) return null;

  return (
    <section
      aria-labelledby={`${pageGroup.id}-title`}
      className="flex flex-col gap-2"
    >
      <h2
        className="text-subtle px-1 text-xs font-semibold tracking-[0.5px] uppercase"
        id={`${pageGroup.id}-title`}
      >
        {capitalizeFirstLetter(pageGroup.name)}
      </h2>
      <ul className="m-0 flex list-none flex-col gap-1 p-0">
        {activePages.map((page) => {
          const isActive = pathname === page.path;

          return (
            <li className="m-0" key={page.path}>
              <NavItemButton
                href={page.path}
                icon={page.icon}
                isActive={isActive}
                label={capitalizeFirstLetter(page.name)}
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default function Navbar() {
  const pathname = usePathname();

  return (
    <>
      <button
        aria-label="Close main menu"
        className="absolute hidden h-full w-full bg-black/5 md:hidden"
        id="overlay"
        onClick={toggleNavbar}
        type="button"
      />
      <aside
        className="border-border-surface bg-surface absolute z-10 flex h-full w-full max-w-60 -translate-x-60 flex-col border-r delay-75 duration-300 md:static md:translate-x-0"
        id="navbar"
      >
        <nav
          aria-label="Main navigation"
          className="flex flex-1 flex-col gap-6 px-4 py-5"
        >
          {PAGE_GROUPS.map((pageGroup) => (
            <PageGroup
              key={pageGroup.id}
              pageGroup={pageGroup}
              pathname={pathname}
            />
          ))}
        </nav>

        <footer className="border-border-surface flex flex-col gap-3 border-t px-4 py-4">
          <NavItemButton
            href="/settings"
            icon={PiGearSixDuotone}
            isActive={pathname === "/settings"}
            label="Settings"
          />

          <div className="border-border-surface flex items-center gap-3 rounded-lg border px-2 py-2">
            <Avatar items={[{ name: "User Name" }]} />
            <div className="min-w-0">
              <p className="text-strong mb-0 truncate text-xs font-semibold">
                User Name
              </p>
              <p className="text-subtle mb-0 truncate text-xs">
                user.name@example.com
              </p>
            </div>
          </div>
        </footer>
      </aside>
    </>
  );
}
