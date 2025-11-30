import { Button, Card } from "react-vant";
import { Link, useParams } from "react-router";
import type { AuthorBookInfo } from "../../types/authorPage";
import Navbar from "../../components/Navbar";
import { formatHeat, formatDate } from "./index";

interface AuthorPageProps {
  authorDetail?: {
    author: {
      id: string;
      name: string;
      isActive: boolean;
      createTime: Date;
      updateTime: Date;
    };
    books: AuthorBookInfo[];
    totalBooks: number;
    totalFired: number;
    latestUpdate?: Date;
  };
  isLoading: boolean;
  error?: Error;
}

export default function PC({
  authorDetail,
  isLoading,
  error
}: AuthorPageProps) {

  // 截取描述为100字
  const truncateDesc = (desc: string) => {
    if (!desc) return '';
    return desc.length > 100 ? desc.substring(0, 100) + '...' : desc;
  };

  // 统计数据
  const totalBooks = authorDetail?.totalBooks || 0;
  const totalFired = authorDetail?.totalFired || 0;

  // 计算每行显示的书籍数量
  const getBooksPerRow = () => {
    const containerWidth = 1200 - 48;
    const cardWidth = 440;
    const gap = 8;
    const booksPerRow = Math.max(1, Math.floor(containerWidth / (cardWidth + gap)));
    return booksPerRow;
  };

  // 将书籍按行分组
  const getBooksByRow = () => {
    if (!authorDetail?.books || authorDetail.books.length === 0) return [];
    
    const booksPerRow = getBooksPerRow();
    const rows = [];
    
    for (let i = 0; i < authorDetail.books.length; i += booksPerRow) {
      rows.push(authorDetail.books.slice(i, i + booksPerRow));
    }
    
    return rows;
  };

  const bookRows = getBooksByRow();

  // 渲染单个书籍卡片
  const renderBookCard = (book: AuthorBookInfo) => (
    <Link to={`/book/${book.id}`}>
      <div key={book.id} className="relative flex-shrink-0">
        <Card className="bg-gray-50 w-full h-45 p-0 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 hover:shadow-lg">
          <Card.Body className="py-0!">
            <div className="flex gap-4">
              {/* 左侧封面图片 */}
              <div className="w-32 h-40 flex-shrink-0">
                {book.bookImage && (
                  <img 
                    src={book.bookImage} 
                    alt={book.name}
                    className="w-full h-full object-cover rounded"
                  />
                )}
              </div>

              {/* 右侧信息区域 */}
              <div className="flex-1 space-y-3 p-4 relative">
                {/* 书名 */}
                <h4 className="text-gray-900 dark:text-white font-bold text-lg leading-tight">
                  {book.name}
                </h4>
                <div className="pt-2 absolute top-10 right-2">
                  <span className={`${book.status.includes('连载') ? 'bg-blue-500' : 'bg-gray-500'} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                    {book.status}
                  </span>
                </div>
                
                {/* 分类信息 */}
                {book.category && (
                  <Link to={`/category/${book.categoryId}`}>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a1.994 1.994 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span className="truncate">{book.category}</span>
                  </div>
                  </Link>
                )}

                {/* 书籍简介 */}
                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 leading-relaxed">
                  {truncateDesc(book.desc)}
                </p>

                {/* 热度显示 */}
                <div className="space-y-1">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    热度: <span className="text-red-500 font-bold">{formatHeat(book.fired)}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </Link>
  );

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Navbar />
        <div className="max-w-7xl mx-auto pt-6 py-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center border border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <div className="text-6xl mb-4">😵</div>
            <h3 className="text-gray-900 dark:text-white text-xl font-bold mb-4">加载失败</h3>
            <p className="text-gray-400 dark:text-gray-400 mb-6">{error.message}</p>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-blue-500 hover:bg-blue-600 border-0"
            >
              🔄 重新加载
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />

      <div className="max-w-7xl mx-auto pt-6 py-6">
        <div className="flex gap-6">
          {/* 左侧边栏 - 作者信息 */}
          <aside className="w-64 flex-shrink-0 flex gap-2 flex-col">
            {/* 作者信息卡片 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-900 dark:text-white font-bold text-lg">👨‍💼 作者信息</h3>
                <svg className="h-4 w-4 text-gray-400 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              
              {authorDetail?.author && (
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold text-2xl">
                        {authorDetail.author.name.charAt(0)}
                      </span>
                    </div>
                    <h4 className="text-gray-900 dark:text-white font-bold text-lg">
                      {authorDetail.author.name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      入驻时间: {formatDate(authorDetail.author.createTime)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 作品统计 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-4 flex items-center">
                <svg className="h-5 w-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                📊 作品统计
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="text-gray-600 dark:text-gray-300 text-sm">作品总数</span>
                  <span className="text-blue-500 font-bold">{totalBooks} 部</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="text-gray-600 dark:text-gray-300 text-sm">总热度</span>
                  <span className="text-red-500 font-bold">{formatHeat(totalFired)}</span>
                </div>
                {authorDetail?.latestUpdate && (
                  <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <span className="text-gray-600 dark:text-gray-300 text-sm">最新更新</span>
                    <span className="text-green-500 font-bold text-sm">
                      {formatDate(authorDetail.latestUpdate)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 快捷操作 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-4">⚡ 快捷操作</h3>
              <div className="space-y-2">
                <Button block className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white">
                  📚 我的书架
                </Button>
                <Button block className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white">
                  🔖 收藏夹
                </Button>
                <Button block className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white">
                  📊 阅读统计
                </Button>
                <Link to="/">
                  <Button block className="bg-blue-500 hover:bg-blue-600 border-0 text-white">
                    🏠 返回首页
                  </Button>
                </Link>
              </div>
            </div>
          </aside>

          {/* 主内容区域 */}
          <main className="flex-1">
            {/* 作品列表 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-gray-900 dark:text-white font-bold text-xl">
                  📚 {authorDetail?.author.name || '作者'} 的作品
                </h3>
                <span className="text-sm text-gray-400 dark:text-gray-400">
                  共 {totalBooks} 部作品
                </span>
              </div>

              {/* 书籍列表 - 按行分组渲染 */}
              {bookRows.length > 0 ? (
                <div className="space-y-2">
                  {bookRows.map((row, rowIndex) => (
                    <div key={rowIndex}>
                      {/* 一行书籍 */}
                      <div className="flex gap-2">
                        {row.map(renderBookCard)}
                      </div>
                      
                      {/* 横线分隔 (除了最后一行) */}
                      {rowIndex < bookRows.length - 1 && (
                        <div className="border-b border-gray-200 dark:border-gray-600 my-4"></div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                /* 空状态显示 */
                <div className="w-full">
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="h-8 w-8 text-gray-400 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h4 className="text-gray-400 dark:text-gray-400 font-medium mb-2">暂无作品</h4>
                    <p className="text-gray-500 dark:text-gray-500 text-sm">
                      该作者暂时没有公开作品，敬请期待更多精彩内容！
                    </p>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
      
      {/* 加载状态 */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center shadow-2xl transition-colors duration-300">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            <div className="text-gray-900 dark:text-white text-lg font-bold">正在加载作者信息...</div>
            <div className="text-gray-400 dark:text-gray-400 text-sm">请稍候，精彩内容即将呈现</div>
          </div>
        </div>
      )}
    </div>
  );
}
