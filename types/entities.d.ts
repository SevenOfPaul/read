// 实体类型声明文件
// 基于 src/entities 目录下的 TypeORM 实体类生成

export interface Author {
  /** 作者ID - UUID */
  id: string;
  
  /** 作者姓名 */
  name: string;
  
  /** 是否启用 */
  isActive: boolean;
  
  /** 删除标记 */
  deleteFlag: boolean;
  
  /** 创建时间 */
  createTime: Date;
  
  /** 更新时间 */
  updateTime: Date;
  
  /** 作者的书籍列表 (一对多) */
  books?: Book[];
}

export interface Book {
  /** 书籍ID - UUID */
  id: string;
  
  /** 书籍名称 */
  name: string;
  
  /** 源地址 */
  originUrl?: string;
  
  /** 书籍描述 */
  desc: string;
  
  /** 书籍首图 */
  bookImage?: string;
  
  /** 书籍状态（连载中、已完结等） */
  status: string;
  
  /** 书籍分类 */
  category: string;
  
  /** 更新时间 */
  updateTime: Date;
  
  /** 是否显示 */
  isShow: boolean;
  
  /** 删除标记 */
  deleteFlag: boolean;
  
  /** 最新章节名称 */
  lastChapter?: string;
  
  /** 作者ID */
  authorId: string;
  
  /** 关联的作者 (多对一) */
  author: Author;
  
  /** 创建时间 */
  createTime: Date;
  
  /** 书籍的章节列表 (一对多) */
  chapters?: Chapter[];
}

export interface Chapter {
  /** 章节ID - UUID */
  id: string;
  
  /** 章节索引 */
  idx?: number;
  
  /** 章节名称 */
  name: string;
  
  /** 章节内容 */
  content?: string;
  
  /** 书籍ID */
  bookId: string;
  
  /** 关联的书籍 (多对一) */
  book: Book;
  
  /** 创建时间 */
  createTime: Date;
  
  /** 更新时间 */
  updateTime: Date;
}
