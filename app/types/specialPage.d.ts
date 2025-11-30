// 专题页面专用类型定义
// 基于 entities.d.ts 和 categorySearch.d.ts 扩展的类型定义

export type { BookInfo } from "./categorySearch";
export type { PaginationInfo } from "./categoryPage";

// 专题类型枚举
export type SpecialType = 'completed' | 'new';

// 专题页面数据
export interface SpecialPageData {
  books: BookInfo[];
  pagination: PaginationInfo;
  isLoading: boolean;
  error?: Error;
}

// 专题配置
export interface SpecialConfig {
  type: SpecialType;
  title: string;
  description: string;
  icon: string;
  bgColor: string;
  textColor: string;
}

// 专题书籍查询参数
export interface SpecialBookListParams {
  type: SpecialType;
  page: number;
  pageSize: number;
}
