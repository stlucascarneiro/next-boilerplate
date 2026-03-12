import Link from "next/link";
import {
  PiCaretDoubleLeftDuotone,
  PiCaretDoubleRightDuotone,
  PiCaretLeftDuotone,
  PiCaretRightDuotone,
} from "react-icons/pi";

import Button from "./Button.client";
import { parseObjectToQueryParams } from "./services/utils";

import { IPagination } from "@/shared/types/api.types";

interface IPaginationProps extends IPagination {
  params: Record<string, boolean | number | string | undefined>;
  path: string;
}

export default function Pagination({
  hasNextPage,
  hasPreviousPage,
  nextPage,
  page,
  params,
  path,
  previousPage,
  records,
  recordsOnPage,
  totalPages,
}: IPaginationProps) {
  const getPath = (page: number) => {
    const query = parseObjectToQueryParams({ ...params, page });

    return query ? `${path}?${query}` : path;
  };

  const renderNavButton = (
    disabled: boolean,
    icon: React.ReactNode,
    label: string,
    targetPage: number,
  ) => {
    const content = <Button disabled={disabled} icon={icon} />;

    if (disabled) {
      return (
        <span aria-disabled="true" title={label}>
          {content}
        </span>
      );
    }

    return (
      <Link aria-label={label} href={getPath(targetPage)}>
        {content}
      </Link>
    );
  };

  return (
    <div className="mt-8 flex items-center justify-between">
      <p className="text-subtle dark:text-dark-subtle mb-0">{`Mostrando ${recordsOnPage} de ${records}`}</p>

      <div className="flex gap-2">
        {renderNavButton(
          !hasPreviousPage,
          <PiCaretDoubleLeftDuotone className="h-5 w-5" />,
          "Primeira página",
          1,
        )}
        {renderNavButton(
          !hasPreviousPage,
          <PiCaretLeftDuotone className="h-5 w-5" />,
          "Página anterior",
          previousPage,
        )}

        <Button
          className="flex w-9 items-center justify-center"
          variant="primary"
        >
          <span>{page}</span>
        </Button>

        {renderNavButton(
          !hasNextPage,
          <PiCaretRightDuotone className="h-5 w-5" />,
          "Próxima página",
          nextPage,
        )}
        {renderNavButton(
          !hasNextPage,
          <PiCaretDoubleRightDuotone className="h-5 w-5" />,
          "Última página",
          totalPages,
        )}
      </div>
    </div>
  );
}
