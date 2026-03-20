"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PiAlignLeftDuotone } from "react-icons/pi";

import Avatar from "../../shared/Avatar";

import Logo from "./Logo";

import Button from "@/shared/Button.client";
import ThemeToggler from "@/shared/ThemeToggler.client";
import { PAGES } from "@/shared/constants/pages.data";
import { toggleNavbar } from "./services/toggleNavbar";

export default function Topbar() {
  const pathname = usePathname();
  const mainPage = pathname.split("/")[1];

  const page = PAGES.find((page) => page.name === mainPage);

  const privatePage = page && page.protected;

  return (
    <header
      className={`border-border-surface bg-surface flex flex-row justify-between border-b p-3 pr-5 delay-75 duration-300`}
    >
      <div className="xs:gap-4 flex items-center gap-2">
        {privatePage && (
          <Button
            icon={<PiAlignLeftDuotone />}
            onClick={toggleNavbar}
            variant="ghost"
          />
        )}
        <Logo />
      </div>

      <div className="xs:gap-3 flex items-center gap-1">
        <ThemeToggler />
        {privatePage ? (
          <Avatar className="ml-2" items={[{ name: "User Name" }]} />
        ) : (
          <Link href="/">
            <Button variant="primary">Sign In</Button>
          </Link>
        )}
      </div>
    </header>
  );
}
