import { Author, Book } from "./entities";

// 上传表单数据类型 - 基于Book实体设计
export interface UploadFormData {
  /** 书籍名称 */
  bookName: string;
  /** 作者姓名 */
  authorName: string;
  /** 书籍内容 (上传时的原始内容) */
  bookContent: string;
  /** 书籍描述 (从内容提取或用户输入) */
  desc?: string;
  /** 书籍首图 */
  bookImage?: string;
  /** 书籍状态（连载中、已完结等） */
  status?: string;
}

// TXT解析结果类型 - 简化版本
export interface ParsedChapter {
  /** 章节标题 */
  title: string;
  /** 章节内容 */
  content: string;
  /** 章节索引 */
  idx: number;
  /** 书籍ID（用于创建章节时） */
  bookId?: string;
}

// 上传进度类型
export interface UploadProgress {
  total: number;
  current: number;
  status: 'idle' | 'parsing' | 'uploading' | 'success' | 'error';
  message?: string;
}

// 上传响应类型
export interface UploadResponse {
  bookId: string;
  authorId: string;
  chapterCount: number;
  bookName: string;
  authorName: string;
}

// 章节解析统计信息 - 简化版本
export interface ChapterParseStats {
  totalChapters: number;
  parseSuccess: boolean;
  errors?: string[];
}
