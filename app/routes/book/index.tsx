import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import type { BookDetail, ChapterInfo, RelatedBook, BookDetailResponse, ChapterListResponse, RelatedBooksResponse } from "../../types/BookDetail";
import PC from "./pc";
import Mobile from "./mobile";
import "./index.css";

const baseUrl = import.meta.env.VITE_webHost;
const imgHost = import.meta.env.VITE_imgHost;

// 根据书籍ID获取书籍详情
async function fetchBookDetail(bookId: string): Promise<BookDetail|undefined> {
  try {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sql: `
        SELECT 
          b.id,
          b."name",
          b.desc,
          b."bookImage",
          b."fired",
          b.status,
          b."categoryId",
          b."authorId",
          b."lastChapter",
          b."createTime",
          b."updateTime",
          b."isShow",
          b."deleteFlag",
          b."originUrl",
          a."name" as "authorName",
          a.id as "authorId",
          c."name" as "categoryName",
          c.id as "categoryId"
        FROM public.book b
        LEFT JOIN public.author a ON b."authorId" = a.id
        LEFT JOIN public.category c ON b."categoryId" = c.id
        WHERE b.id ='${bookId}' AND b."deleteFlag" = false
       `
      }),
    });

    await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sql: `
        UPDATE public.book SET "fired"="fired"+1 WHERE id = '${bookId}'`
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: BookDetailResponse = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || "获取书籍详情失败");
    }
    
    if (!result.data) {
      throw new Error("书籍不存在");
    }

    // 处理图片URL
    const bookData = result.data
    if(bookData&&Array.isArray(bookData)){
    return bookData[0];
    }

  } catch (error) {
    console.error("获取书籍详情失败:", error);
    throw error;
  }
}

// 获取章节列表（不分卷）
async function fetchChapters(bookId: string): Promise<ChapterInfo[]> {
  try {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sql: `SELECT 
          id,
          idx,
          "name",
          "createTime",
          "updateTime"
        FROM public.chapter
        WHERE "bookId" = '${bookId}'
        ORDER BY "idx" ASC`
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ChapterListResponse = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || "获取章节列表失败");
    }
    
    return result.data || [];
  } catch (error) {
    console.error("获取章节列表失败:", error);
    throw error;
  }
}

// 获取相关书籍推荐
async function fetchRelatedBooks(categoryId: string, currentBookId: string): Promise<RelatedBook[]> {
  try {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sql: `SELECT 
          b.id,
          b."name",
          b."bookImage",
          b."lastChapter",
          b status,
          a."name" as "authorName"
        FROM public.book b
        LEFT JOIN public.author a ON b."authorId" = a.id
        WHERE b."categoryId" = '${categoryId}' AND b."deleteFlag" = false AND b.id != '${currentBookId}'
        LIMIT 6`
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: RelatedBooksResponse = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || "获取相关书籍失败");
    }
    
    return result.data || [];
  } catch (error) {
    console.error("获取相关书籍失败:", error);
    throw error;
  }
}

// 获取书籍详情的Hook
export function useBookDetail() {
  const { bookId } = useParams<{ bookId: string }>();
  
  return useQuery({
    queryKey: ['book', bookId],
    queryFn: () => fetchBookDetail(bookId!),
    enabled: !!bookId,
  });
}

// 获取章节列表的Hook
export function useChapters() {
  const { bookId } = useParams<{ bookId: string }>();
  
  return useQuery({
    queryKey: ['chapters', bookId],
    queryFn: () => fetchChapters(bookId!),
    enabled: !!bookId,
  });
}

// 获取相关书籍的Hook
export function useRelatedBooks(categoryId: string, currentBookId: string) {
  return useQuery({
    queryKey: ['relatedBooks', categoryId, currentBookId],
    queryFn: () => fetchRelatedBooks(categoryId, currentBookId),
    enabled: !!categoryId && !!currentBookId,
  });
}

// 处理章节点击事件
export function handleChapterClick(chapterId: string, bookId: string) {
  console.log(`跳转到阅读页面 - 书籍ID: '${bookId}', 章节ID: '${chapterId}'`);
  // 这里可以跳转到阅读页面，格式类似 /read/:bookId/:chapterId
}

// 处理收藏功能
export function handleBookmark(bookId: string) {
  console.log(`收藏书籍: '${bookId}'`);
  // 这里实现收藏逻辑
}

// 处理分享功能
export function handleShare(bookId: string, bookName: string) {
  console.log(`分享书籍: ${bookName} ('${bookId}')`);
  // 这里实现分享逻辑
}

export default function BookDetail() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {isMobile ? <Mobile /> : <PC />}
    </div>
  );
}
