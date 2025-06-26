import React from 'react';
import { PaginationProps } from '@/types/pagination';

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  onPrevious,
  onNext,
}) => {
  const renderPageButton = (page: number) => (
    <button
      key={page}
      onClick={() => onPageChange(page)}
      style={{
        padding: "6px 14px",
        borderRadius: "50%",
        background: currentPage === page ? "var(--color-green-soft)" : "transparent",
        color: "var(--color-secondary)",
        border: "none",
        fontWeight: 700,
        fontFamily: "Abel, sans-serif",
        fontSize: 20,
        margin: "0 2px",
        cursor: "pointer",
        minWidth: 36,
        minHeight: 36,
      }}
    >
      {page}
    </button>
  );

  const renderEllipsis = (key: string) => (
    <span
      key={key}
      style={{
        color: "var(--color-secondary)",
        opacity: 0.4,
        fontSize: 20,
        margin: "0 6px",
        fontFamily: "Abel, sans-serif",
      }}
    >
      ...
    </span>
  );

  const renderNavigationButton = (
    label: string,
    onClick: () => void,
    disabled: boolean
  ) => (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "6px 22px",
        borderRadius: 24,
        background: "var(--color-green-soft)",
        color: disabled ? "rgba(28,54,37,0.3)" : "var(--color-secondary)",
        border: "none",
        fontWeight: 500,
        fontFamily: "Abel, sans-serif",
        fontSize: 20,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.7 : 1,
        letterSpacing: "0.04em",
        transition: "background 0.2s",
        minWidth: 90,
      }}
    >
      {label}
    </button>
  );

  const renderPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => renderPageButton(i + 1));
    }

    const items = [];
    
    // First page
    if (currentPage > 2) {
      items.push(renderPageButton(1));
    }

    // Start ellipsis
    if (currentPage > 3) {
      items.push(renderEllipsis("start-ellipsis"));
    }

    // Middle pages (current and neighbors)
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);
    for (let i = startPage; i <= endPage; i++) {
      items.push(renderPageButton(i));
    }

    // End ellipsis
    if (currentPage < totalPages - 2) {
      items.push(renderEllipsis("end-ellipsis"));
    }

    // Last page
    if (currentPage < totalPages - 1) {
      items.push(renderPageButton(totalPages));
    }

    return items;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-10 items-center" style={{ gap: 8 }}>
      {renderNavigationButton(
        "« PREVIOUS",
        onPrevious,
        currentPage === 1
      )}
      
      {renderPageNumbers()}
      
      {renderNavigationButton(
        "NEXT »",
        onNext,
        currentPage === totalPages
      )}
    </div>
  );
};

export default Pagination;