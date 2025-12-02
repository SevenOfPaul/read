import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router";
import type { ChapterRead, ChapterInfo, ChapterNavigation } from "../../types/ChapterRead";
import type { ChapterReadResponse, ChapterListResponse, ChapterNavigationResponse } from "../../types/ChapterRead";
import PC from "./pc";
import Mobile from "./mobile";
import "./index.css";

const baseUrl = import.meta.env.VITE_webHost;

// 获取章节详细内容
async function fetchChapterContent(bookId: string, chapterId: string): Promise<ChapterRead|undefined> {
  try {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sql: `
        SELECT 
          c.id,
          c.idx,
          c.name,
          c.content,
          c."bookId",
          c."createTime",
          c."updateTime",
          b.name as "bookName",
          b."authorId",
          a.name as "authorName"
        FROM public.chapter c
        LEFT JOIN public.book b ON c."bookId" = b.id
        LEFT JOIN public.author a ON b."authorId" = a.id
        WHERE c.id = '${chapterId}' AND c."bookId" = '${bookId}' ORDER BY c."idx" ASC
       `
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ChapterReadResponse = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || "获取章节内容失败");
    }
    
    if (!result.data) {
      throw new Error("章节不存在");
    }

    // 处理返回的数据
    const chapterData = result.data[0];
    if (chapterData) {
      return {
        id: chapterData.id,
        name: chapterData.name,
        content: chapterData.content || "",
        idx: chapterData.idx || 0,
        bookId: chapterData.bookId,
        createTime: new Date(chapterData.createTime),
        updateTime: new Date(chapterData.updateTime),
        book: {
          id: chapterData.bookId,
          name: chapterData.bookName,
          authorName: chapterData.authorName,
          authorId: chapterData.authorId,
        },
      };
    }

  } catch (error) {
    console.error("获取章节内容失败:", error);
    throw error;
  }
}

// 获取章节列表
async function fetchChapters(bookId: string): Promise<ChapterInfo[]> {
  try {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sql: `
        SELECT 
          id,
          idx,
          name
        FROM public.chapter
        WHERE "bookId" = '${bookId}'
        ORDER BY "idx" ASC
       `
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

// 获取章节导航信息
function getChapterNavigation(chapters: ChapterInfo[], currentChapterId: string): ChapterNavigation {
  const currentIndex = chapters.findIndex(chapter => chapter.id === currentChapterId);
  
  return {
    prevChapter: currentIndex > 0 ? chapters[currentIndex - 1] : undefined,
    nextChapter: currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : undefined,
    currentIndex: currentIndex + 1,
    totalChapters: chapters.length,
  };
}

// 获取章节内容的Hook
export function useChapterContent() {
  const { bookId, chapterId } = useParams<{ bookId: string; chapterId: string }>();
  
  return useQuery({
    queryKey: ['chapter', bookId, chapterId],
    queryFn: () => fetchChapterContent(bookId!, chapterId!),
    enabled: !!bookId && !!chapterId,
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

// 处理章节导航
export function handleChapterNavigation(
  navigate: ReturnType<typeof useNavigate>,
  bookId: string,
  chapterId: string,
  direction: 'prev' | 'next'
) {
  // 这里先不实现，实际导航逻辑在PC组件中处理
  console.log(`导航到${direction === 'prev' ? '上一章' : '下一章'}: 书籍ID ${bookId}, 章节ID ${chapterId}`);
}

// 处理章节跳转
export function handleChapterJump(
  navigate: ReturnType<typeof useNavigate>,
  bookId: string,
  chapterId: string
) {
  navigate(`/read/${bookId}/${chapterId}`);
}

export default function ChapterRead() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {isMobile ? <Mobile /> : <PC />}
    </div>
  );
}
