import React, { useMemo } from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const result = [];
    const add = (val) => result.push(val);

    add(1);
    const left = Math.max(2, currentPage - 1);
    const right = Math.min(totalPages - 1, currentPage + 1);

    if (left > 2) add("...");
    for (let p = left; p <= right; p++) add(p);
    if (right < totalPages - 1) add("...");
    add(totalPages);

    return result;
  }, [currentPage, totalPages]);

  const goTo = (p) => {
    if (typeof p === "number" && p >= 1 && p <= totalPages && p !== currentPage) {
      onPageChange(p);
    }
  };

  return (
    <div className="flex items-center justify-center mt-6 gap-2 flex-wrap w-full">
      <button
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-full bg-[#1e294a] text-white hover:bg-[#27345d] disabled:opacity-40"
      >
        ‹
      </button>

      {pages.map((p, idx) =>
        p === "..." ? (
          <span key={`dots-${idx}`} className="px-2 text-white opacity-60 select-none">…</span>
        ) : (
          <button
            key={p}
            onClick={() => goTo(p)}
            className={`px-3 py-1 rounded-full min-w-[40px] ${
              currentPage === p
                ? "bg-gradient-to-r from-purple-500 to-pink-400 text-white shadow-md"
                : "bg-[#1e294a] text-white hover:bg-[#27345d]"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-full bg-[#1e294a] text-white hover:bg-[#27345d] disabled:opacity-40"
      >
        ›
      </button>
    </div>
  );
};

export default Pagination;


