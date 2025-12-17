import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { RankingBook, RankingType, RankingConfig, RankingData } from "../../types/rankingPage";
import type { Response } from "../../types/Response";
import PC from "./pc";
import Mobile from "./mobile";
import { customFetch } from "../../lib/fetch";

const baseUrl = import.meta.env.VITE_webHost;
const imgHost = import.meta.env.VITE_imgHost;

// 排行榜配置映射
const RANKING_CONFIGS: Record<RankingType, RankingConfig> = {
  update: {
    type: 'update',
    title: '更新榜',
    description: '最新更新 · 第一时间抢先看',
    icon: '🔄',
    bgColor: 'bg-gradient-to-r from-blue-500 to-cyan-600',
    textColor: 'text-blue-600'
  },
  heat: {
    type: 'heat',
    title: '热度榜',
    description: '人气最热 · 最受喜爱',
    icon: '🔥',
    bgColor: 'bg-gradient-to-r from-red-500 to-pink-600',
    textColor: 'text-red-600'
  },
  words: {
    type: 'words',
    title: '字数榜',
    description: '内容丰富 · 精彩长篇',
    icon: '📚',
    bgColor: 'bg-gradient-to-r from-purple-500 to-indigo-600',
    textColor: 'text-purple-600'
  }
};

// 获取更新榜数据（按更新时间排序）
async function fetchUpdateRanking(): Promise<RankingBook[]> {
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
          b."status",
          b."fired",
          b."lastChapter",
          b."updateTime",
          a."name" as "author",
          b."authorId" as "authorId",
          c."name" as "categoryName"
        FROM public.book b
        LEFT JOIN public.author a ON b."authorId" = a.id
        LEFT JOIN public.category c ON b."categoryId" = c.id
        WHERE b."deleteFlag" = false AND b."isShow" = true
        ORDER BY b."updateTime" DESC
        LIMIT 10`
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: Response<RankingBook[]> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || "获取更新榜数据失败");
    }
    
    // 处理图片URL并添加排名
    const processedBooks = result.data?.map((book, index) => ({
      ...book,
      bookImage: book.bookImage ? `${imgHost}${book.bookImage}` : undefined,
      rank: index + 1,
      updateTime: new Date(book.updateTime || new Date())
    })) || [];
    
    return processedBooks;
  } catch (error) {
    console.error("获取更新榜数据失败:", error);
    throw error;
  }
}

// 获取热度榜数据（按热度排序）
async function fetchHeatRanking(): Promise<RankingBook[]> {
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
          b."status",
          b."fired",
          b."lastChapter",
          a."name" as "author",
          b."authorId" as "authorId",
          c."name" as "categoryName"
        FROM public.book b
        LEFT JOIN public.author a ON b."authorId" = a.id
        LEFT JOIN public.category c ON b."categoryId" = c.id
        WHERE b."deleteFlag" = false AND b."isShow" = true
        ORDER BY b."fired" DESC
        LIMIT 10`
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: Response<RankingBook[]> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || "获取热度榜数据失败");
    }
    
    // 处理图片URL并添加排名
    const processedBooks = result.data?.map((book, index) => ({
      ...book,
      bookImage: book.bookImage ? `${imgHost}${book.bookImage}` : undefined,
      rank: index + 1
    })) || [];
    
    return processedBooks;
  } catch (error) {
    console.error("获取热度榜数据失败:", error);
    throw error;
  }
}

// 获取字数榜数据（按章节数量排序）
async function fetchWordsRanking(): Promise<RankingBook[]> {
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
          b."status",
          b."fired",
          b."lastChapter",
          a."name" as "author",
          b."authorId" as "authorId",
          c."name" as "categoryName",
          COALESCE(cc.chapter_count, 0) as "chapterCount"
        FROM public.book b
        LEFT JOIN public.author a ON b."authorId" = a.id
        LEFT JOIN public.category c ON b."categoryId" = c.id
        LEFT JOIN (
          SELECT "bookId", COUNT(id) as chapter_count
          FROM public.chapter
          GROUP BY "bookId"
        ) cc ON b.id = cc."bookId"
        WHERE b."deleteFlag" = false AND b."isShow" = true
        ORDER BY cc.chapter_count DESC NULLS LAST
        LIMIT 10`
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: Response<RankingBook[]> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || "获取字数榜数据失败");
    }
    
    // 处理图片URL并添加排名
    const processedBooks = result.data?.map((book, index) => ({
      ...book,
      bookImage: book.bookImage ? `${imgHost}${book.bookImage}` : undefined,
      rank: index + 1,
      chapterCount: book.chapterCount || 0
    })) || [];
    
    return processedBooks;
  } catch (error) {
    console.error("获取字数榜数据失败:", error);
    throw error;
  }
}

// 排行榜查询Hook
export function useRankingData(type: RankingType) {
  return useQuery({
    queryKey: ['ranking', type],
    queryFn: () => {
      switch (type) {
        case 'update':
          return fetchUpdateRanking();
        case 'heat':
          return fetchHeatRanking();
        case 'words':
          return fetchWordsRanking();
        default:
          return fetchUpdateRanking();
      }
    },
    staleTime: 5 * 60 * 1000, // 5分钟缓存
    refetchOnWindowFocus: false,
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

// 获取排行榜配置
export function getRankingConfig(type: string): RankingConfig {
  const rankingType = type as RankingType;
  return RANKING_CONFIGS[rankingType] || RANKING_CONFIGS.update;
}

export default function Ranking() {
  const [currentTab, setCurrentTab] = useState<RankingType>('update');
  
  // 获取当前榜单数据
  const { data: books = [], isLoading, error } = useRankingData(currentTab);
  
  // 获取当前榜单配置
  const rankingConfig = getRankingConfig(currentTab);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {isMobile ? (
        <Mobile
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          rankingConfig={rankingConfig}
          books={books}
          isLoading={isLoading}
          error={error!}
        />
      ) : (
        <PC
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          rankingConfig={rankingConfig}
          books={books}
          isLoading={isLoading}
          error={error!}
        />
      )}
    </div>
  );
}
