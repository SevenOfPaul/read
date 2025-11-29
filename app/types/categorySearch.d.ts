// 扩展实体类型声明文件
// 基于 entities.d.ts 扩展的类型定义

export type { Category } from "./entities";
export type { Book } from "./entities";

// 书籍信息（用于首页展示）
export interface BookInfo {
  /** 书籍ID - UUID */
  id: string;
  
  /** 书籍名称 */
  name: string;
  
  /** 书籍描述 */
  desc: string;
  
  /** 书籍首图 */
  bookImage?: string;
  
  /** 书籍状态（连载中、已完结等） */
  status: string;
  
  /** 作者姓名 */
  author: string;
  
  /** 最新章节名称 */
  lastChapter?: string;
  
  /** 热度值 */
  fired?: number;
}

// 包含书籍信息的分类（基础分类信息 + 书籍列表）
export interface CategoryWithBooks {
  /** 分类ID - UUID */
  id: string;
  
  /** 分类名称 */
  name: string;
  
  /** 创建时间 */
  createTime: Date;
  
  /** 更新时间 */
  updateTime: Date;
  
  /** 删除标记 */
  deleteFlag: boolean;
  
  /** 分类的书籍列表 (最多5本) */
  books: BookInfo[];
}

// 热门书籍信息（用于畅销榜）
export interface HotBook {
  /** 书籍ID - UUID */
  id: string;
  
  /** 书籍名称 */
  name: string;
  
  /** 作者姓名 */
  author: string;
  
  /** 热度值 */
  fired: number;
  
  /** 书籍状态 */
  status: string;
}
