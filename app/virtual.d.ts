import type { Book, Author, Chapter, Category } from "types/entities";

/**
 * 网站配置接口
 */
interface SiteConfig {
  /** 网站标题 */
  title: string;
  
  /** 网站描述 */
  description: string;
  
  /** 网站关键词 */
  keywords: string[];
  
  /** 默认作者 */
  defaultAuthor?: Author;
  
  /** 默认分类 */
  defaultCategory?: Category;
  
  /** 最近更新的书籍数量 */
  recentBooksLimit: number;
  
  /** 热门书籍数量 */
  hotBooksLimit: number;
}

/**
 * 书籍清单接口
 */
interface BookManifest {
  /** 网站配置 */
  siteConfig: SiteConfig;
  
  /** 所有书籍列表 */
  books: Book[];
  
  /** 所有作者列表 */
  authors: Author[];
  
  /** 所有章节列表 */
  chapters: Chapter[];
  
  /** 所有分类列表 */
  categories: Category[];
  
  /** 热门书籍 */
  hotBooks: Book[];
  
  /** 最近更新书籍 */
  recentBooks: Book[];
  
  /** 按分类分组的书籍 */
  booksByCategory: Record<string, Book[]>;
  
  /** 按作者分组的书籍 */
  booksByAuthor: Record<string, Book[]>;
}

declare module "virtual:book-manifest" {
  const manifest: BookManifest;
  export default manifest;
}
