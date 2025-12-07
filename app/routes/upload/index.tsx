import { useState } from "react";
import type { UploadFormData, UploadProgress, UploadResponse } from "../../types/upload";
import { ChapterParser } from "./chapterParser";
import PC from "./pc";
import Mobile from "./mobile";

// 上传处理函数 - 简化版本，只做本地解析处理
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

  const uploadMutation = {
    mutate: async (formData: UploadFormData) => {
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
    isPending: false,
    progress,
    error: null as Error | null,
    result: parseResult
  };

  return uploadMutation;
}

export default function Upload() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {isMobile ? <Mobile /> : <PC />}
    </div>
  );
}
