import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import type { UploadFormData, UploadProgress, UploadResponse } from "../../types/upload";
import type { Response } from "../../types/Response";
import { ChapterParser } from "./chapterParser";
import PC from "./pc";
import Mobile from "./mobile";

const baseUrl = import.meta.env.VITE_webHost;

// 检查是否已存在同名同作者的书籍
async function fetchDuplicateCheck(bookName: string, authorName: string): Promise<boolean> {
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
          a."name" as "author"
        FROM public.book b
        LEFT JOIN public.author a ON b."authorId" = a.id
        WHERE b."deleteFlag" = false 
          AND b."name" = '${bookName}'
          AND a."name" = '${authorName}'
        LIMIT 1` 
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || "检查重复失败");
    }
    
    return result.data && result.data.length > 0;
  } catch (error) {
    console.error("检查重复书籍失败:", error);
    throw error;
  }
}

// 重复检查查询
export function useCheckDuplicateBook(bookName: string, authorName: string) {
  return useQuery({
    queryKey: ['checkDuplicate', bookName, authorName],
    queryFn: () => fetchDuplicateCheck(bookName, authorName),
    enabled: !!bookName && !!authorName && bookName.trim().length > 0 && authorName.trim().length > 0,
    staleTime: 30000, // 30秒缓存
    refetchOnWindowFocus: false,
  });
}

// 上传处理函数 - 保持原有逻辑，只添加@tanstack/react-query支持
export function useUpload() {
  const [progress, setProgress] = useState<UploadProgress>({
    total: 0,
    current: 0,
    status: 'idle'
  });

  const [parseResult, setParseResult] = useState<{
    chapters: any[];
    stats: any;
  } | null>(null);

  const uploadMutation = useMutation({
    mutationFn: async (formData: UploadFormData) => {
      const parser = new ChapterParser();
      
      setProgress({
        total: 3,
        current: 0,
        status: 'parsing',
        message: '正在解析TXT文件...'
      });

      // 解析章节
      const chapters = parser.parseTxtContent(formData.bookContent);
      setProgress({
        total: 3,
        current: 1,
        status: 'parsing',
        message: `解析完成，发现 ${chapters.length} 个章节`
      });

      // 统计信息（简化版本 - 分章节已直接合并）
      const stats = {
        totalChapters: chapters.length,
        parseSuccess: true
      };

      setParseResult({
        chapters,
        stats
      });

      setProgress({
        total: 3,
        current: 2,
        status: 'uploading',
        message: '正在处理数据...'
      });

      // 模拟处理时间
      await new Promise(resolve => setTimeout(resolve, 1000));

      setProgress({
        total: 3,
        current: 3,
        status: 'success',
        message: '解析完成！'
      });

      return {
        bookId: 'demo-book-id',
        authorId: 'demo-author-id',
        chapterCount: chapters.length,
        bookName: formData.bookName,
        authorName: formData.authorName
      } as UploadResponse;
    },
    onError: (error) => {
      console.error('上传失败:', error);
      setProgress({
        total: 3,
        current: 0,
        status: 'error',
        message: error instanceof Error ? error.message : '上传失败'
      });
    }
  });

  // 返回与原来兼容的对象
  return {
    ...uploadMutation,
    progress,
    result: parseResult
  };
}

export default function Upload() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {isMobile ? <Mobile /> : <PC />}
    </div>
  );
}
