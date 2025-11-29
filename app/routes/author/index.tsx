import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import type { AuthorDetail } from "../../types/authorPage";
import type { Response } from "../../types/Response";
import PC from "./pc";
import Mobile from "./mobile";

const baseUrl = import.meta.env.VITE_webHost;
const imgHost = import.meta.env.VITE_imgHost;

// 获取作者详情及其所有书籍信息
async function fetchAuthorDetail(authorId: string): Promise<AuthorDetail> {
  try {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        sql: `SELECT 
          a.id,
          a.name,
          a."isActive",
          a."createTime",
          a."updateTime",
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
                    'fired', b."fired",
                    'lastChapter', b."lastChapter",
                    'updateTime', b."updateTime",
                    'category', c."name",
                    'categoryId',c."id"
                  )
                ELSE NULL
              END
              ORDER BY b."updateTime" DESC
            ) FILTER (WHERE b.id IS NOT NULL),
            '[]'::json
          ) as books
        FROM public.author a
        LEFT JOIN (
          SELECT *
          FROM public.book 
          WHERE "deleteFlag" = false AND "isShow" = true
        ) b ON a.id = b."authorId"
        LEFT JOIN public.category c ON b."categoryId" = c.id
        WHERE a.id = '${authorId}' AND a."deleteFlag" = false AND a."isActive" = true
        GROUP BY a.id, a.name, a."isActive", a."createTime", a."updateTime"` 
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: Response<Array<{
      id: string;
      name: string;
      isActive: boolean;
      createTime: string;
      updateTime: string;
      books: Array<{
        id: string;
        name: string;
        desc: string;
        bookImage?: string;
        status: string;
        fired: number;
        lastChapter?: string;
        updateTime: string;
        category?: string;
      }>;
    }>> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || "获取作者数据失败");
    }
    
    const authorData = result.data?.[0];
    if (!authorData) {
      throw new Error("作者不存在或已被禁用");
    }

    // 处理数据，添加图片URL和统计信息
    const processedBooks = authorData.books?.map(book => ({
      ...book,
      bookImage: book.bookImage ? `${imgHost}${book.bookImage}` : undefined,
      updateTime: new Date(book.updateTime)
    })) || [];

    // 计算统计数据
    const totalBooks = processedBooks.length;
    const totalFired = processedBooks.reduce((sum, book) => sum + book.fired, 0);
    const latestUpdate = processedBooks.length > 0 
      ? processedBooks.reduce((latest, book) => 
          book.updateTime > latest ? book.updateTime : latest, 
          processedBooks[0].updateTime
        )
      : undefined;

    return {
      author: {
        id: authorData.id,
        name: authorData.name,
        isActive: authorData.isActive,
        createTime: new Date(authorData.createTime),
        updateTime: new Date(authorData.updateTime),
        deleteFlag: false,
        books: []
      },
      books: processedBooks,
      totalBooks,
      totalFired,
      latestUpdate
    };
  } catch (error) {
    console.error("获取作者数据失败:", error);
    throw error;
  }
}

export function useAuthorDetail(authorId: string) {
  return useQuery({
    queryKey: ['authorDetail', authorId],
    queryFn: () => fetchAuthorDetail(authorId),
    enabled: !!authorId,
  });
}

// 格式化热度显示
export function formatHeat(fired: number): string {
  if (fired >= 10000) {
    return `🔥 ${(fired / 10000).toFixed(1)}万`;
  } else if (fired >= 1000) {
    return `🔥 ${(fired / 1000).toFixed(1)}千`;
  } else {
    return `🔥 ${fired}`;
  }
}

// 格式化日期显示
export function formatDate(date: Date): string {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export default function Author() {
  const { authorId } = useParams();
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  const { data: authorDetail, isLoading, error } = useAuthorDetail(authorId || '');
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {isMobile ? (
        <Mobile 
          authorDetail={authorDetail}
          isLoading={isLoading}
          error={error!}
        />
      ) : (
        <PC 
          authorDetail={authorDetail}
          isLoading={isLoading}
          error={error!}
        />
      )}
    </div>
  );
}
