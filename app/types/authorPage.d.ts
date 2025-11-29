// 作者页面专用类型定义
// 基于 entities.d.ts 扩展的类型定义

import type { Author, Book } from "./entities";

// 作者书籍信息（简化版，用于列表显示）
export interface AuthorBookInfo {
  id: string;
  name: string;
  desc: string;
  bookImage?: string;
  status: string;
  categoryId:string
  fired: number;
  lastChapter?: string;
  updateTime: Date;
  category?: string;
}

// 作者详情页面数据
export interface AuthorDetail {
  author: Author;
  books: AuthorBookInfo[];
  totalBooks: number;
  totalFired: number;
  latestUpdate?: Date;
}

// 作者页面数据
export interface AuthorPageData {
  authorDetail?: AuthorDetail;
  isLoading: boolean;
  error?: Error;
}

// 书籍查询参数（暂时不需要，为未来扩展准备）
export interface AuthorBooksParams {
  authorId: string;
  page?: number;
  pageSize?: number;
}
