"use client";

import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { PiArrowLeftBold } from "react-icons/pi";
import Button from "./Button.client";

interface IProps {
  returnPath?: string;
  rightContent?: ReactNode;
  showReturn?: boolean;
  title: string;
  titleHierarchy?: "h1" | "h2" | "h3";
}

export default function Header({
  returnPath,
  rightContent,
  showReturn,
  title,
  titleHierarchy,
}: IProps) {
  const { back, push } = useRouter();
  const TitleTag = titleHierarchy || "h2";

  const onReturnHandler = () => {
    if (returnPath) push(returnPath);
    else back();
  };

  return (
    <div className="flex items-center gap-2">
      {showReturn && (
        <Button
          icon={<PiArrowLeftBold />}
          onClick={onReturnHandler}
          variant="ghost"
        ></Button>
      )}
      <TitleTag className="grow">{title}</TitleTag>
      {rightContent && <div className="ml-auto">{rightContent}</div>}
    </div>
  );
}
