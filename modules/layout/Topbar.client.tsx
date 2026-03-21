"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import Button from "@/shared/Button.client";
import Input from "@/shared/Input.client";
import ThemeToggler from "@/shared/ThemeToggler.client";
import { PAGE_GROUPS } from "@/shared/constants/pages.data";
import { PiBellDuotone, PiListBold, PiPlusBold } from "react-icons/pi";
import Logo from "./Logo";
import { toggleNavbar } from "./services/toggleNavbar";

export default function Topbar() {
  const pathname = usePathname();
  const mainPage = pathname.split("/")[1];

  const page = PAGE_GROUPS.find((page) => page.name === mainPage);

  const privatePage = page;

  return (
    <header
      className={`border-border-surface bg-surface flex h-16 flex-row items-center justify-between border-b pr-5 delay-75 duration-300`}
    >
      <div className="border-border-surface flex h-full w-60 pl-6 md:border-r">
        <Logo />
      </div>
      <div className="hidden grow items-center gap-3 px-8 md:flex">
        <Input
          className="max-w-96 grow"
          label=""
          name="general-search"
          placeholder="Search..."
          type="text"
        />
      </div>
      <div className="xs:gap-3 hidden items-center gap-1 md:flex">
        <ThemeToggler />
        <Link href="/">
          <Button icon={<PiPlusBold className="text-sm" />} variant="primary">
            New Content
          </Button>
        </Link>
      </div>
      <div className="xs:gap-3 flex items-center gap-1 md:hidden">
        <Button icon={<PiBellDuotone className="text-xl" />} variant="ghost" />
        <Button
          icon={<PiListBold className="text-xl" />}
          onClick={toggleNavbar}
          variant="ghost"
        />
      </div>
    </header>
  );
}
