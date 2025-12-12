import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import type { UploadFormData, UploadProgress, UploadResponse } from "../../types/upload";
import type { Response } from "../../types/Response";
import { ChapterParser } from "./chapterParser";
import PC from "./pc";
import Mobile from "./mobile";
import type { Category } from "../../types/entities";

const baseUrl = import.meta.env.VITE_webHost;

// 获取分类列表
async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sql: `SELECT id, name FROM public.category WHERE "deleteFlag" = false ORDER BY name`
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || "获取分类失败");
    }

    return result.data || [];
  } catch (error) {
    console.error("获取分类失败:", error);
    throw error;
  }
}

// 检查或创建作者
async function fetchOrCreateAuthor(authorName: string): Promise<string> {
  try {
    const escapedAuthorName = authorName;
    
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sql: `WITH existing_author AS (
                SELECT id FROM public.author 
                WHERE "name" = '${escapedAuthorName}' AND "deleteFlag" = false 
                LIMIT 1
              ),
              new_author AS (
                INSERT INTO public.author ("name", "isActive", "deleteFlag", "createTime", "updateTime")
                SELECT '${escapedAuthorName}', true, false, NOW(), NOW()
                WHERE NOT EXISTS (SELECT 1 FROM existing_author)
                RETURNING id
              )
              SELECT id FROM existing_author
              UNION ALL
              SELECT id FROM new_author
              LIMIT 1`
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || "处理作者失败");
    }

    if (!result.data || result.data.length === 0) {
      throw new Error("处理作者未返回有效数据");
    }

    return result.data[0].id;
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
  status?: string;
  categoryId?: string;
}): Promise<{ bookId: string; authorId: string; }> {
  try {
    // 提取书名前50个字符作为描述
    const description = bookData.desc || bookData.bookName.substring(0, 50);
    // 默认状态为"连载中"
    const status = bookData.status || '连载中';
    // 如果没有选择分类，设为null
    const categoryId = bookData.categoryId || null;
    
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sql: `WITH existing_book AS (
                SELECT id, "authorId" FROM public.book 
                WHERE "name" = '${bookData.bookName}' AND "authorId" = '${bookData.authorId}' AND "deleteFlag" = false 
                LIMIT 1
              ),
              new_book AS (
                INSERT INTO public.book (
                  "name", "desc", "bookImage", "status", "categoryId", "authorId", 
                  "isShow", "deleteFlag", "createTime", "updateTime", "fired"
                )
                VALUES (
                  '${bookData.bookName}', 
                  '${description}', 
                  '${bookData.bookImage || ''}', 
                  '${status}', 
                  ${categoryId ? `'${categoryId}'` : 'NULL'}, 
                  '${bookData.authorId}', 
                  true, 
                  false, 
                  NOW(), 
                  NOW(), 
                  0
                )
                RETURNING id, "authorId"
              )
              SELECT id, "authorId" FROM existing_book
              UNION ALL
              SELECT id, "authorId" FROM new_book
              LIMIT 1`
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

// 简单的SQL字符串转义函数
function escapeSqlString(str: string): string {
  return str.replace(/'/g, "''").replace(/\\/g, "\\\\");
}

// 批量创建章节 - 使用传统转义
async function fetchCreateChapters(bookId: string, chapters: any[]): Promise<void> {
  try {
    // 每100章为一片进行处理
    const batchSize = 5;
    const batches = [];
    
    for (let i = 0; i < chapters.length; i += batchSize) {
      batches.push(chapters.slice(i, i + batchSize));
    }

    console.log(`开始保存章节，总共 ${chapters.length} 章，分为 ${batches.length} 片`);

    // 循环执行每一片
    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];
      console.log(`正在保存第 ${batchIndex + 1}/${batches.length} 片章节...`);
      
      // 构建批量插入SQL - 使用简单的转义
      const values = batch.map((chapter, index) => {
        const actualIndex = batchIndex * batchSize + index;
        const title = escapeSqlString(chapter.title);
        const content = escapeSqlString(chapter.content);
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
      
      // 添加短暂延迟，避免请求过于频繁
      if (batchIndex < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    console.log(`所有章节保存完成，共 ${chapters.length} 章，${batches.length} 片`);
    return Promise.resolve();
  } catch (error) {
    console.error("创建章节失败:", error);
    throw error;
  }
}

// 获取分类数据
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });
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

      // 创建书籍 - 传递categoryId参数
      const bookResult = await fetchCreateBook({
        bookName: formData.bookName,
        authorId,
        bookImage: formData.bookImage,
        desc: formData.desc,
        status: formData.status,
        categoryId: formData.categoryId
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
