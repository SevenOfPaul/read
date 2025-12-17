import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router";
import type { Category, CategoryWithBooks } from "../../types/categorySearch";
import type { BookInfo, PaginationInfo, BookListParams } from "../../types/categoryPage";
import type { Response } from "../../types/Response";
import PC from "./pc";
import Mobile from "./mobile";
import "./index.css"
import { customFetch } from "../../lib/fetch";

const baseUrl = import.meta.env.VITE_webHost;
const imgHost = import.meta.env.VITE_imgHost;

// 获取所有分类列表
async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await customFetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sql: `SELECT 
          id,
          name,
          "createTime",
          "updateTime",
          "deleteFlag"
        FROM public.category
        WHERE "deleteFlag" = false
        ORDER BY "createTime" DESC`
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: Response<Category[]> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || "获取分类数据失败");
    }
    
    return result.data || [];
  } catch (error) {
    console.error("获取分类数据失败:", error);
    throw error;
  }
}

// 获取分类下的书籍列表（支持分页）
async function fetchCategoryBooks(params: BookListParams): Promise<{ books: BookInfo[]; total: number }> {
  try {
    const { categoryId, page, pageSize } = params;
    const offset = (page - 1) * pageSize;

    let sqlCondition = '';
    if (categoryId && categoryId !=="''") {
      // 如果有特定的分类ID，只查询该分类的书籍
      sqlCondition = `WHERE b."categoryId" = '${categoryId}' AND b."deleteFlag" = false AND b."isShow" = true`;
    } else {
      // 如果是空字符串或undefined，查询所有书籍
      sqlCondition = `WHERE b."deleteFlag" = false AND b."isShow" = true`;
    }

    // 并行获取书籍列表和总数
    const [booksResponse, countResponse] = await Promise.all([
      customFetch(baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sql: `SELECT 
            b.id,
            b."name",
            b."desc",
            b."bookImage",
            b."status",
            b."fired",
            b."lastChapter",
            a."name" as "author",
            b."authorId" as "authorId"
          FROM public.book b
          LEFT JOIN public.author a ON b."authorId" = a.id
          ${sqlCondition}
          ORDER BY b."createTime" DESC
          LIMIT ${pageSize} OFFSET ${offset}`
        }),
      }),
      customFetch(baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sql: `SELECT COUNT(*) as total
          FROM public.book b
          ${sqlCondition}`
        }),
      })
    ]);

    if (!booksResponse.ok || !countResponse.ok) {
      throw new Error(`HTTP error! books: ${booksResponse.status}, count: ${countResponse.status}`);
    }

    const booksResult: Response<BookInfo[]> = await booksResponse.json();
    const countResult: Response<{ total: number }[]> = await countResponse.json();

    if (!booksResult.success) {
      throw new Error(booksResult.message || "获取书籍数据失败");
    }

    if (!countResult.success) {
      throw new Error(countResult.message || "获取统计数据失败");
    }

    // 处理图片URL
    const processedBooks = booksResult.data?.map(book => ({
      ...book,
      bookImage: book.bookImage ? `${imgHost}${book.bookImage}` : undefined
    })) || [];

    const total = countResult.data?.[0]?.total || 0;

    return { books: processedBooks, total };
  } catch (error) {
    console.error("获取分类书籍数据失败:", error);
    throw error;
  }
}

// 获取分类信息的Hook
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000, // 5分钟缓存
  });
}

// 获取分类书籍的Hook
export function useCategoryBooks(categoryId: string | null, page: number, pageSize: number) {
  return useQuery({
    queryKey: ['categoryBooks', categoryId, page],
    queryFn: () => fetchCategoryBooks({ categoryId: categoryId || '', page, pageSize }),
    staleTime: 2 * 60 * 1000, // 2分钟缓存
    refetchOnWindowFocus: false,
    refetchOnMount: 'always',
  });
}

// 格式化热度显示（复用首页逻辑）
export function formatHeat(fired: number): string {
  if (fired >= 10000) {
    return `🔥 ${(fired / 10000).toFixed(1)}万`;
  } else if (fired >= 1000) {
    return `🔥 ${(fired / 1000).toFixed(1)}千`;
  } else {
    return `🔥 ${fired}`;
  }
}

export default function Category() {
  const { categoryId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12; // 改为每页12条
  
  // 获取 Query Client 实例用于缓存管理
  const queryClient = useQueryClient();

  // 获取所有分类
  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useCategories();

  // 获取当前分类的书籍
  const { data: booksData, isLoading: booksLoading, error: booksError } = useCategoryBooks(
    categoryId || null, 
    currentPage, 
    pageSize
  );


  // 计算分页信息
  const pagination: PaginationInfo = useMemo(() => {
    const total = booksData?.total || 0;
    const totalPages = Math.ceil(total / pageSize);
    
    return {
      currentPage,
      pageSize,
      total,
      totalPages
    };
  }, [booksData?.total, currentPage, pageSize]);

  // 获取当前分类信息（包含"全部"选项）
  const currentCategory = useMemo(() => {
    if (categoryId === '' || categoryId === undefined) {
      return {
        id: "''",
        name: '全部',
        createTime: new Date(),
        updateTime: new Date(),
        deleteFlag: false
      };
    }
    return categories?.find(cat => cat.id === categoryId);
  }, [categories, categoryId]);

  // 添加"全部"分类选项
  const allCategory: Category = {
    id: '',
    name: '全部',
    createTime: new Date(),
    updateTime: new Date(),
    deleteFlag: false
  };

  // 将"全部"分类放在最前面
  const categoriesWithAll = [allCategory, ...(categories || [])];

  const isLoading = categoriesLoading || booksLoading;
  const error = categoriesError || booksError;

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {isMobile ? (
        <Mobile
          categories={categoriesWithAll}
          currentCategory={currentCategory}
          books={booksData?.books || []}
          pagination={pagination}
          isLoading={isLoading}
          error={error!}
          onPageChange={handlePageChange}
        />
      ) : (
        <PC
          categories={categoriesWithAll}
          currentCategory={currentCategory}
          books={booksData?.books || []}
          pagination={pagination}
          isLoading={isLoading}
          error={error!}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
