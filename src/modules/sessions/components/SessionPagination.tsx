import { Button } from "@/shared/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (nextPage: number) => void;
  className?: string;
};

function buildItems(currentPage: number, totalPages: number): Array<number | "..."> {
  const last = Math.max(1, totalPages);
  if (last <= 5) return Array.from({ length: last }, (_, i) => i + 1);

  const items: Array<number | "..."> = [1];

  if (currentPage - 1 > 2) items.push("...");
  if (currentPage - 1 >= 2) items.push(currentPage - 1);

  if (currentPage !== 1 && currentPage !== last) items.push(currentPage);

  if (currentPage + 1 <= last - 1) items.push(currentPage + 1);
  if (currentPage + 1 < last - 1) items.push("...");

  items.push(last);
  return items.filter((v, i, a) => a.indexOf(v) === i);
}

export const Pagination = ({ currentPage, totalPages, onPageChange, className = "" }: PaginationProps) => {
  const safeTotal = Math.max(1, totalPages);
  const items = buildItems(currentPage, safeTotal);
  const isPrevDisabled = currentPage <= 1;
  const isNextDisabled = currentPage >= safeTotal;

  return (
    <div className={`pager ${className}`}>
      <Button
        type="button"
        aria-label="Page précédente"
        className={`pager__btn pager__btn--icon ${isPrevDisabled ? "is-disabled" : ""}`}
        disabled={isPrevDisabled}
        onClick={() => !isPrevDisabled && onPageChange(currentPage - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {items.map((pageItem, itemIndex) =>
        pageItem === "..." ? (
          <span key={`dots-${itemIndex}`} className="pager__ellipsis">
            …
          </span>
        ) : (
          <Button
            key={pageItem}
            type="button"
            aria-current={pageItem === currentPage ? "page" : undefined}
            className={`pager__btn ${pageItem === currentPage ? "is-active" : ""}`}
            onClick={() => onPageChange(pageItem as number)}
          >
            {pageItem}
          </Button>
        ),
      )}

      <Button
        type="button"
        aria-label="Page suivante"
        className={`pager__btn pager__btn--icon ${isNextDisabled ? "is-disabled" : ""}`}
        disabled={isNextDisabled}
        onClick={() => !isNextDisabled && onPageChange(currentPage + 1)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
