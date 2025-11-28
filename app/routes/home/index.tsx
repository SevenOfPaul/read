import { useQuery } from "@tanstack/react-query";
import type { Category, CategoryWithBooks } from "../../../types/categorySearch";
import type { Response } from "../../../types/Response";
import PC from "./pc";
import Mobile from "./mobile";

const baseUrl = import.meta.env.VITE_webHost;
const imgHost = import.meta.env.VITE_imgHost;

// 使用联合查询获取分类及其对应的书籍信息
async function fetchCategories(): Promise<CategoryWithBooks[]> {
  try {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        sql: `SELECT 
          c.id,
          c.name,
          c."createTime",
          c."updateTime",
          c."deleteFlag",
          COALESCE(
            json_agg(
              CASE 
                WHEN b.id IS NOT NULL THEN 
                  json_build_object(
                    'id', b.id,
                    'name', b."name",
                    'desc', b."desc",
                    'bookImage', b."bookImage",
                    'status', b."status",
                    'author', a."name",
                    'lastChapter', b."lastChapter"
                  )
                ELSE NULL
              END
              ORDER BY b."createTime" DESC
            ) FILTER (WHERE b.id IS NOT NULL),
            '[]'::json
          ) as books
        FROM public.category c
        LEFT JOIN (
          SELECT DISTINCT ON ("categoryId") *
          FROM public.book 
          ORDER BY "categoryId", "createTime" DESC
          LIMIT 50
        ) b ON c.id = b."categoryId"
        LEFT JOIN public.author a ON b."authorId" = a.id
        WHERE c."deleteFlag" = false
        GROUP BY c.id, c.name, c."createTime", c."updateTime", c."deleteFlag"
        ORDER BY c."createTime" DESC` 
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: Response<CategoryWithBooks[]> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || "获取分类数据失败");
    }
    
    // 直接拼接图片URL
    const processedData = result.data?.map(category => ({
      ...category,
      books: category.books?.map(book => ({
        ...book,
        bookImage: book.bookImage ? `${imgHost}${book.bookImage}` : undefined
      })) || []
    })) || [];
    
    return processedData;
  } catch (error) {
    console.error("获取分类数据失败:", error);
    throw error;
  }
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });
}

export function handleSearch() {
  console.log("搜索功能开发中...");
}

export default function Home() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  return isMobile ? <Mobile /> : <PC />;
}
