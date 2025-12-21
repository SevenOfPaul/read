import { useQuery } from "@tanstack/react-query";
import type { SearchParams as SearchParamsType, SearchResult as SearchResultType } from "../../types/search";
import type { Response } from "../../types/Response";
import PC from "./pc";
import Mobile from "./mobile";

const baseUrl = import.meta.env.VITE_webHost;
const imgHost = import.meta.env.VITE_imgHost;
import customFetch from "@/lib/fetch";

// 搜索函数
async function searchBooks(params: SearchParamsType): Promise<SearchResultType> {
  try {
    const response = await customFetch(baseUrl, {
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
          b.status,
          b."fired",
          a."name" as "author",
          b."authorId",
          b."lastChapter"
        FROM public.book b
        LEFT JOIN public.author a ON b."authorId" = a.id
        WHERE b."deleteFlag" = false 
          AND b."isShow" = true
          AND (
            b."name" ILIKE '%${params.keyword}%' 
            OR a."name" ILIKE '%${params.keyword}%'
          )
        ORDER BY b."fired" DESC
        LIMIT ${params.pageSize || 20} OFFSET ${((params.page || 1) - 1) * (params.pageSize || 20)}`
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: Response<any[]> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || "搜索失败");
    }

    // 获取总数
    const countResponse = await customFetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        sql: `SELECT COUNT(*) as total
        FROM public.book b
        LEFT JOIN public.author a ON b."authorId" = a.id
        WHERE b."deleteFlag" = false 
          AND b."isShow" = true
          AND (
            b."name" ILIKE '%${params.keyword}%' 
            OR a."name" ILIKE '%${params.keyword}%'
          )`
      }),
    });

    const countResult: Response<any> = await countResponse.json();
    const total = countResult.data?.[0]?.total || 0;
    const pageSize = params.pageSize || 20;
    const totalPages = Math.ceil(total / pageSize);

    // 处理数据，添加图片完整URL
    const processedBooks = result.data?.map(book => ({
      ...book,
      bookImage: book.bookImage ? `${imgHost}${book.bookImage}` : undefined
    })) || [];

    return {
      books: processedBooks,
      total,
      currentPage: params.page || 1,
      totalPages,
      keyword: params.keyword
    };
  } catch (error) {
    console.error("搜索失败:", error);
    throw error;
  }
}

// 热门搜索函数
async function fetchHotSearches(): Promise<string[]> {
  try {
    // 这里可以返回一个模拟的热门搜索列表，实际项目中可以从API获取
    return [
      "斗破苍穹",
      "我在天牢，长生不死", 
      "末世第一狠人"
    ];
  } catch (error) {
    console.error("获取热门搜索失败:", error);
    return [];
  }
}

// 搜索钩子
export function useSearchBooks(params: SearchParamsType) {
  return useQuery({
    queryKey: ['searchBooks', params.keyword, params.page],
    queryFn: () => searchBooks(params),
    enabled: !!params.keyword, // 只有当有关键词时才执行搜索
  });
}

// 热门搜索钩子
export function useHotSearches() {
  return useQuery({
    queryKey: ['hotSearches'],
    queryFn: fetchHotSearches,
  });
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* 使用Tailwind CSS的响应式类来控制显示 */}
      <div className="hidden md:block">
        <PC />
      </div>
      <div className="block md:hidden">
        <Mobile />
      </div>
    </div>
  );
}
