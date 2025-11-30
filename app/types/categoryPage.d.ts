// 分类页面专用类型定义
// 基于 entities.d.ts 和 categorySearch.d.ts 扩展的类型定义

export type { Category, Book } from "./entities";
export type { BookInfo } from "./categorySearch";

// 分页信息
export interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// 分类页面数据
export interface CategoryPageData {
  categories: Category[];
  currentCategory?: Category;
  books: BookInfo[];
  pagination: PaginationInfo;
  isLoading: boolean;
  error?: Error;
}

// 书籍分页查询参数
export interface BookListParams {
  categoryId: string;
  page: number;
  pageSize: number;
}
