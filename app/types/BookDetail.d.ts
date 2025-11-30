import type { Author, Category } from './entities';
import type { Response } from './Response';

// 书籍详细信息接口
export interface BookDetail {
  id: string;
  name: string;
  desc: string;
  bookImage?: string;
  fired:number
  status: string;
  categoryId?: string;
  authorId: string;
  lastChapter?: string;
  createTime: Date;
  authorName: string
  categoryName: string
  updateTime: Date;
  isShow: boolean;
  deleteFlag: boolean;
  originUrl?: string;

  author: Author;
  category?: Category;
}

// 章节信息接口（用于章节列表显示）
export interface ChapterInfo {
  id: string;
  idx?: number;
  name: string;
  createTime: Date;
  updateTime: Date;
}

// 相关书籍推荐类型
export interface RelatedBook {
  id: string;
  name: string;
  bookImage?: string;
  authorName: string
  authorId:string
  lastChapter?: string;
  status: string;
}

// API响应类型声明
export type BookDetailResponse = Response<BookDetail[]>;
export type ChapterListResponse = Response<ChapterInfo[]>;
export type RelatedBooksResponse = Response<RelatedBook[]>;
