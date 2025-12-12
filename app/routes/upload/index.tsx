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

// 检查或创建作者
async function fetchOrCreateAuthor(authorName: string): Promise<string> {
  try {
    // 首先检查作者是否已存在
    const checkResponse = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sql: `SELECT id FROM public.author 
              WHERE "name" = '${authorName}' AND "deleteFlag" = false 
              LIMIT 1`
      }),
    });

    if (!checkResponse.ok) {
      throw new Error(`HTTP error! status: ${checkResponse.status}`);
    }

    const checkResult = await checkResponse.json();
    
    if (!checkResult.success) {
      throw new Error(checkResult.message || "检查作者失败");
    }

    // 如果作者已存在，返回作者ID
    if (checkResult.data && checkResult.data.length > 0) {
      return checkResult.data[0].id;
    }

    // 如果作者不存在，创建新作者
    const createResponse = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sql: `INSERT INTO public.author ("name", "isActive", "deleteFlag", "createTime", "updateTime")
              VALUES ('${authorName}', true, false, NOW(), NOW())
              RETURNING id`
      }),
    });

    if (!createResponse.ok) {
      throw new Error(`HTTP error! status: ${createResponse.status}`);
    }

    const createResult = await createResponse.json();
    
    if (!createResult.success) {
      throw new Error(createResult.message || "创建作者失败");
    }

    if (!createResult.data || createResult.data.length === 0) {
      throw new Error("创建作者未返回有效数据");
    }

    return createResult.data[0].id;
  } catch (error) {
    console.error("处理作者失败:", error);
    throw error;
  }
}

// 创建书籍
async function fetchCreateBook(bookData: {
  bookName: string;
  authorId: string;
  bookImage?: string;
  desc?: string;
}): Promise<{ bookId: string; authorId: string; }> {
  try {
    // 提取书名前50个字符作为描述
    const description = bookData.desc || bookData.bookName.substring(0, 50);
    
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sql: `INSERT INTO public.book (
              "name", "desc", "bookImage", "status", "authorId", 
              "isShow", "deleteFlag", "createTime", "updateTime", "fired"
            )
            VALUES (
              '${bookData.bookName}', 
              '${description}', 
              '${bookData.bookImage || ''}', 
              '连载中', 
              '${bookData.authorId}', 
              true, 
              false, 
              NOW(), 
              NOW(), 
              0
            )
            RETURNING id, "authorId"`
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || "创建书籍失败");
    }

    if (!result.data || result.data.length === 0) {
      throw new Error("创建书籍未返回有效数据");
    }

    return {
      bookId: result.data[0].id,
      authorId: result.data[0].authorId,
    };
  } catch (error) {
    console.error("创建书籍失败:", error);
    throw error;
  }
}

// 批量创建章节
async function fetchCreateChapters(bookId: string, chapters: any[]): Promise<void> {
  try {
    // 每100章为一片进行处理
    const batchSize = 100;
    const batches = [];
    
    for (let i = 0; i < chapters.length; i += batchSize) {
      batches.push(chapters.slice(i, i + batchSize));
    }

    console.log(`开始保存章节，总共 ${chapters.length} 章，分为 ${batches.length} 片`);

    // 循环执行每一片
    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];
      console.log(`正在保存第 ${batchIndex + 1}/${batches.length} 片章节...`);
      
      // 构建批量插入SQL
      const values = batch.map((chapter, index) => {
        const actualIndex = batchIndex * batchSize + index;
        // 处理单引号转义
        const title = chapter.title.replace(/'/g, "''");
        const content = chapter.content.replace(/'/g, "''");
        return `('${title}', '${content}', '${bookId}', ${actualIndex}, NOW(), NOW())`;
      }).join(',');

      const response = await fetch(baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sql: `INSERT INTO public.chapter ("name", "content", "bookId", "idx", "createTime", "updateTime")
                VALUES ${values}
                RETURNING id`
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || `创建第${batchIndex + 1}片章节失败`);
      }

      console.log(`第 ${batchIndex + 1}/${batches.length} 片章节保存完成 (${batch.length}章)`);
      
      // 添加短暂延迟，避免请求过于频繁
      if (batchIndex < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    console.log(`所有章节保存完成，共 ${chapters.length} 章，${batches.length} 片`);
  } catch (error) {
    console.error("创建章节失败:", error);
    throw error;
  }
}

// 上传处理函数 - 实现真正的数据库操作
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
        total: 5,
        current: 0,
        status: 'parsing',
        message: '正在解析TXT文件...'
      });

      // 解析章节
      const chapters = parser.parseTxtContent(formData.bookContent);
      setProgress({
        total: 5,
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
        total: 5,
        current: 2,
        status: 'uploading',
        message: '正在处理作者信息...'
      });

      // 处理作者：检查或创建
      const authorId = await fetchOrCreateAuthor(formData.authorName);
      
      setProgress({
        total: 5,
        current: 3,
        status: 'uploading',
        message: '正在创建书籍记录...'
      });

      // 创建书籍
      const bookResult = await fetchCreateBook({
        bookName: formData.bookName,
        authorId,
        bookImage: formData.bookImage,
        desc: formData.desc
      });

      setProgress({
        total: 5,
        current: 4,
        status: 'uploading',
        message: '正在保存章节数据...'
      });

      // 批量保存章节（按100章为一片）
      await fetchCreateChapters(bookResult.bookId, chapters);

      setProgress({
        total: 5,
        current: 5,
        status: 'success',
        message: '上传完成！'
      });

      return {
        bookId: bookResult.bookId,
        authorId: bookResult.authorId,
        chapterCount: chapters.length,
        bookName: formData.bookName,
        authorName: formData.authorName
      } as UploadResponse;
    },
    onError: (error) => {
      console.error('上传失败:', error);
      setProgress({
        total: 5,
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
