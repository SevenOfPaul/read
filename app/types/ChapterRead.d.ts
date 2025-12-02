import type { Response } from './Response';

// 章节阅读内容接口
export interface ChapterRead {
  id: string;
  name: string;
  content: string;
  idx: number;
  bookId: string;
  createTime: Date;
  updateTime: Date;
  book: {
    id: string;
    name: string;
    authorName: string;
    authorId: string;
  };
}

// 章节基本信息（用于导航）
export interface ChapterInfo {
  id: string;
  idx: number;
  name: string;
}

// 章节导航信息
export interface ChapterNavigation {
  prevChapter?: ChapterInfo;
  nextChapter?: ChapterInfo;
  currentIndex: number;
  totalChapters: number;
}

// API响应类型
export type ChapterReadResponse = Response<ChapterRead>;
export type ChapterListResponse = Response<ChapterInfo[]>;
export type ChapterNavigationResponse = Response<ChapterNavigation>;
