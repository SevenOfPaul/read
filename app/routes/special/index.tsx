import { useQuery } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router";
import type { BookInfo } from "../../types/categorySearch";
import type { Response } from "../../types/Response";
import type { SpecialConfig, SpecialType,PaginationInfo } from "../../types/specialPage";
import PC from "./pc";
import Mobile from "./mobile";
import  customFetch  from '@/lib/fetch';
const baseUrl = import.meta.env.VITE_webHost;
const imgHost = import.meta.env.VITE_imgHost;

// 专题配置映射
const SPECIAL_CONFIGS: Record<SpecialType, SpecialConfig> = {
  completed: {
    type: 'completed',
    title: '精品完结',
    description: '精选完结 · 无需等待完整阅读',
    icon: '🏆',
    bgColor: 'bg-gradient-to-r from-purple-500 to-indigo-600',
    textColor: 'text-purple-600'
  },
  new: {
    type: 'new',
    title: '最新上架',
    description: '新鲜出炉 · 一月内精品新书',
    icon: '✨',
    bgColor: 'bg-gradient-to-r from-blue-500 to-cyan-600',
    textColor: 'text-blue-600'
  }
};

// 获取专题书籍列表（支持分页）
async function fetchSpecialBooks(params: { type: SpecialType; page: number; pageSize: number }): Promise<{ books: BookInfo[]; total: number }> {
  try {
    const { type, page, pageSize } = params;
    const offset = (page - 1) * pageSize;

    let sqlCondition = '';
    
    if (type === 'completed') {
      // 完结书籍：查询状态为已完结的书籍
      sqlCondition = `WHERE b."status"='全本' AND b."deleteFlag" = false AND b."isShow" = true`;
    } else if (type === 'new') {
      // 新书：查询创建时间在一个月内的书籍
      sqlCondition = `WHERE b."createTime" >= NOW() - INTERVAL '1 month' AND b."deleteFlag" = false AND b."isShow" = true`;
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
            b."authorId" as "authorId",
            c."name" as "categoryName"
          FROM public.book b
          LEFT JOIN public.author a ON b."authorId" = a.id
          LEFT JOIN public.category c ON b."categoryId" = c.id
          ${sqlCondition}
          ORDER BY b."createTime" DESC
          LIMIT ${pageSize} OFFSET ${offset}`
        }),
      }),
      fetch(baseUrl, {
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
    console.error("获取专题书籍数据失败:", error);
    throw error;
  }
}

// 获取专题书籍的Hook
export function useSpecialBooks(type: SpecialType | null, page: number, pageSize: number) {
  return useQuery({
    queryKey: ['specialBooks', type, page],
    queryFn: () => fetchSpecialBooks({ type: type!, page, pageSize }),
    staleTime: 2 * 60 * 1000, // 2分钟缓存
    refetchOnWindowFocus: false,
    refetchOnMount: 'always',
    enabled: !!type, // 只有当type存在时才执行查询
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

// 获取专题配置
export function getSpecialConfig(type: string): SpecialConfig {
  const specialType = type as SpecialType;
  return SPECIAL_CONFIGS[specialType] || SPECIAL_CONFIGS.completed;
}

export default function Special() {
  const { type } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12; // 每页12条

  // 获取当前专题配置
  const specialConfig = getSpecialConfig(type || 'completed');

  // 获取专题书籍
  const { data: booksData, isLoading, error } = useSpecialBooks(
    type as SpecialType, 
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

  // 页面切换时重置到第一页
  useEffect(() => {
    setCurrentPage(1);
  }, [type]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // 如果是无效的专题类型，显示404或重定向
  if (!['completed', 'new'].includes(type || '')) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">页面不存在</h2>
          <p className="text-gray-600 dark:text-gray-400">请检查URL是否正确</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {isMobile ? (
        <Mobile
          specialConfig={specialConfig}
          books={booksData?.books || []}
          pagination={pagination}
          isLoading={isLoading}
          error={error!}
          onPageChange={handlePageChange}
        />
      ) : (
        <PC
          specialConfig={specialConfig}
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
