import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// 兼容react-vant Pagination的props接口
export interface PaginationProps {
  value: number;
  onChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
  showPageSize?: number;
  forceEllipses?: boolean;
  className?: string;
  prevText?: string;
  nextText?: string;
  disabled?: boolean;
}

const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  ({ 
    value, 
    onChange, 
    totalItems, 
    itemsPerPage,
    showPageSize = 5,
    forceEllipses = true,
    className,
    prevText = "Previous",
    nextText = "Next",
    disabled = false
  }, ref) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    // 生成页码数组
    const generatePageNumbers = () => {
      const pages: (number | 'ellipsis')[] = [];
      
      if (totalPages <= showPageSize) {
        // 如果总页数小于等于显示页数，显示所有页码
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // 计算显示范围
        const halfSize = Math.floor(showPageSize / 2);
        let start = Math.max(1, value - halfSize);
        let end = Math.min(totalPages, start + showPageSize - 1);
        
        // 调整起始位置，确保显示足够页码
        if (end - start + 1 < showPageSize) {
          start = Math.max(1, end - showPageSize + 1);
        }
        
        // 添加首页
        if (start > 1) {
          pages.push(1);
          if (start > 2 && forceEllipses) {
            pages.push('ellipsis');
          }
        }
        
        // 添加页码范围
        for (let i = start; i <= end; i++) {
          pages.push(i);
        }
        
        // 添加尾页
        if (end < totalPages) {
          if (end < totalPages - 1 && forceEllipses) {
            pages.push('ellipsis');
          }
          pages.push(totalPages);
        }
      }
      
      return pages;
    };
    
    const pageNumbers = generatePageNumbers();
    
    const handlePageChange = (page: number) => {
      if (!disabled && page !== value && page >= 1 && page <= totalPages) {
        onChange(page);
      }
    };
    
    const handlePrevious = () => {
      handlePageChange(value - 1);
    };
    
    const handleNext = () => {
      handlePageChange(value + 1);
    };
    
    return (
      <nav
        ref={ref as any}
        role="navigation"
        aria-label="pagination"
        className={cn("flex items-center justify-center space-x-1", className)}
      >
        {/* 上一页按钮 */}
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          disabled={disabled || value <= 1}
          className="flex items-center gap-1 cursor-pointer"
          aria-label="上一页"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">{prevText}</span>
        </Button>
        
        {/* 页码列表 */}
        <div className="flex items-center space-x-1">
          {pageNumbers.map((page, index) => {
            if (page === 'ellipsis') {
              return (
                <div
                  key={`ellipsis-${index}`}
                  className="flex h-9 w-9 items-center justify-center cursor-default"
                  aria-hidden="true"
                >
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </div>
              );
            }
            
            const pageNumber = page as number;
            const isActive = pageNumber === value;
            
            return (
              <Button
                key={pageNumber}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(pageNumber)}
                disabled={disabled}
                className={cn(
                  "w-9 h-9 cursor-pointer",
                  isActive && "bg-primary hover:bg-primary/90 text-white!"
                )}
                aria-label={`第 ${pageNumber} 页`}
                aria-current={isActive ? "page" : undefined}
              >
                {pageNumber}
              </Button>
            );
          })}
        </div>
        
        {/* 下一页按钮 */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={disabled || value >= totalPages}
          className="flex items-center gap-1 cursor-pointer"
          aria-label="下一页"
        >
          <span className="hidden sm:inline">{nextText}</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </nav>
    );
  }
);

Pagination.displayName = "Pagination";

export { Pagination };
