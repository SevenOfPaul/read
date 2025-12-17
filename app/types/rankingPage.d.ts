// 排行榜页面类型定义

// 排行榜书籍信息
export interface RankingBook {
  id: string;
  name: string;
  desc: string;
  bookImage?: string;
  status: string;
  fired: number;
  lastChapter?: string;
  author: string;
  authorId: string;
  categoryName?: string;
  updateTime?: Date;
  chapterCount?: number;
  rank: number; // 排名
}

// 排行榜类型
export type RankingType = 'update' | 'heat' | 'words';

// 榜单配置
export interface RankingConfig {
  type: RankingType;
  title: string;
  description: string;
  icon: string;
  bgColor: string;
  textColor: string;
}

// 排行榜数据结构
export interface RankingData {
  books: RankingBook[];
  total: number;
}

// 分页信息
export interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
