"use client"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import { formUrlQuery } from "@/lib/utils";
import { ApiPaginationMeta } from "@/types";
import { usePathname, useSearchParams } from "next/navigation";

const MAX_PAGES_BEFORE_AFTER = 2;

interface PaginationContainerProps {
  containerClasses?: string;
  meta: ApiPaginationMeta;
}

const PaginationContainer = ({
  containerClasses,
  meta
}: PaginationContainerProps) => {
  const items: Number[] = [];
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const page = Number(searchParams.get("page")) || 1;

  // Here only two pages before and after the current one are displayed
  // Adjust as needed
  for (let i = page; i >= page - MAX_PAGES_BEFORE_AFTER && i >= 1; i--) {
    items.push(i)
  }

  items.reverse();

  for (let i = page + 1; i <= page + MAX_PAGES_BEFORE_AFTER && i <= meta.lastPage; i++) {
    items.push(i)
  }

  const getNewUrl = (page: number) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "page",
      value: String(page),
      pathname
    });

    return newUrl;
  }

  return (
    <div className={`flex min-h-9 w-fit items-center justify-between gap-1 py-2 ${containerClasses}`}>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={page !== 1 ? getNewUrl(page - 1) : ""}
              className={page === 1 ? "cursor-not-allowed opacity-50" : ""}
              onClick={(e) => {
                if (page === 1) {
                  e.preventDefault();
                }
              }}
            />
          </PaginationItem>
          {items.map((item) => (
              <PaginationItem
                key={`pagination-link-${item}`}
              >
                <PaginationLink
                  href={getNewUrl(item as number)}
                  isActive={item === page}
                >
                  {String(item)}
                </PaginationLink>
              </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href={page !== meta.lastPage ? getNewUrl(page + 1) : ""}
              className={page === meta.lastPage ? "cursor-not-allowed opacity-50" : ""}
              onClick={(e) => {
                if (page === meta.lastPage) {
                  e.preventDefault();
                }
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <span className="small-regular text-black_light900">
        Showing {meta.from} - {meta.to} of{" "}
        {meta.total} results
      </span>
    </div>
  );
};

export default PaginationContainer;
