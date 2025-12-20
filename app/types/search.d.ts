// 搜索相关类型定义
import type { BookInfo } from "./categorySearch";

// 搜索请求参数
export interface SearchParams {
  /** 搜索关键词 */
  keyword: string;
  /** 页码 */
  page?: number;
  /** 每页数量 */
  pageSize?: number;
}

// 搜索结果
export interface SearchResult {
  /** 搜索到的书籍列表 */
  books: BookInfo[];
  /** 总数量 */
  total: number;
  /** 当前页码 */
  currentPage: number;
  /** 总页数 */
  totalPages: number;
  /** 搜索关键词 */
  keyword: string;
}

// 热门搜索
export interface HotSearch {
  /** 搜索词 */
  keyword: string;
  /** 搜索次数 */
  count: number;
}

// 搜索历史记录
export interface SearchHistory {
  /** 搜索关键词 */
  keyword: string;
  /** 搜索时间 */
  timestamp: number;
}
