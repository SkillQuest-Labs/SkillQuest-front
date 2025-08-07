import { ChevronLeft, ChevronRight } from "lucide-react";

export type PaginationProps = {
  page: number;
  setPage: (p: number) => void;
  totalPages: number;
};

export function Pagination({ page, setPage, totalPages }: PaginationProps) {
  return (
    <div className="skill-pagination flex justify-center items-center mt-0 !py-0 !min-h-0 h-auto">
      <button
        className="skill-pagination-arrow !w-7 !h-7 !p-0.5"
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
        aria-label="Page précédente"
      >
        <ChevronLeft size={18} />
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
        <button
          key={num}
          className={`skill-pagination-btn !text-xs !min-w-[1.5rem] !min-h-[1.5rem] !h-7 !p-0${num === page ? " selected" : ""}`}
          onClick={() => setPage(num)}
          aria-current={num === page ? "page" : undefined}
          aria-label={`Page ${num}`}
        >
          {num}
        </button>
      ))}
      <button
        className="skill-pagination-arrow !w-7 !h-7 !p-0.5"
        onClick={() => setPage(page + 1)}
        disabled={page === totalPages}
        aria-label="Page suivante"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
