import { Button, Card, Pagination } from "react-vant";
import { Link, useParams } from "react-router";
import type { BookInfo } from "@/types/categorySearch";
import type { SpecialConfig,PaginationInfo } from "@/types/specialPage";
import Navbar from "@/components/Navbar";
import BookCard from "@/components/BookCard";

interface SpecialPageProps {
  specialConfig: SpecialConfig;
  books: BookInfo[];
  pagination: PaginationInfo;
  isLoading: boolean;
  error?: Error;
  onPageChange: (page: number) => void;
}

export default function PC({
  specialConfig,
  books,
  pagination,
  isLoading,
  error,
  onPageChange
}: SpecialPageProps) {
  const { type } = useParams();

  // 计算每行显示的书籍数量
  const getBooksPerRow = () => {
    // 估算每行可容纳的卡片数量
    // 主内容区域宽度约 1200px，减去 padding 和 gap
    const containerWidth = 1200 - 48; // max-w-7xl (1280px) - padding (48px)
    const cardWidth = 440; // w-110 大概是 440px
    const gap = 8; // gap-2 大概是 8px
    const booksPerRow = Math.max(1, Math.floor(containerWidth / (cardWidth + gap)));
    return booksPerRow;
  };

  // 将书籍按行分组
  const getBooksByRow = () => {
    if (books.length === 0) return [];
    
    const booksPerRow = getBooksPerRow();
    const rows = [];
    
    for (let i = 0; i < books.length; i += booksPerRow) {
      rows.push(books.slice(i, i + booksPerRow));
    }
    
    return rows;
  };

  const bookRows = getBooksByRow();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* 使用公共导航栏组件 */}
      <Navbar />

      <div className="max-w-7xl mx-auto pt-6 py-6">
        <div className="flex gap-6">
          {/* 左侧边栏 - 专题导航 */}
          <aside className="w-64 flex-shrink-0 flex gap-2 flex-col">
            {/* 专题信息卡片 */}
            <div className={`${specialConfig.bgColor} rounded-lg p-6 text-white border-0 transition-colors duration-300`}>
              <div className="text-center">
                <div className="text-4xl mb-3">{specialConfig.icon}</div>
                <h2 className="text-xl font-bold mb-2">{specialConfig.title}</h2>
                <p className="text-sm opacity-90">{specialConfig.description}</p>
              </div>
            </div>

            {/* 快捷导航 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-4">📚 专题导航</h3>
              <div className="space-y-1">
                <Link
                  to="/special/completed"
                  className={`block cursor-pointer px-3 py-2 rounded transition-colors ${
                    type === 'completed'
                      ? 'text-white bg-purple-500'
                      : 'text-gray-600 dark:text-gray-300 hover:text-white hover:bg-gray-700 dark:hover:bg-gray-700'
                    }`}
                >
                  🏆 完结精品
                </Link>
                <Link
                  to="/special/new"
                  className={`block cursor-pointer px-3 py-2 rounded transition-colors ${
                    type === 'new'
                      ? 'text-white bg-blue-500'
                      : 'text-gray-600 dark:text-gray-300 hover:text-white hover:bg-gray-700 dark:hover:bg-gray-700'
                    }`}
                >
                  ✨ 最新上架
                </Link>
                <Link
                  to="/category/''"
                  className="block cursor-pointer px-3 py-2 rounded transition-colors text-gray-600 dark:text-gray-300 hover:text-white hover:bg-gray-700 dark:hover:bg-gray-700"
                >
                  📖 全部分类
                </Link>
              </div>
            </div>

            {/* 专题统计 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-4 flex items-center">
                <svg className="h-5 w-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                📊 专题统计
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="text-gray-600 dark:text-gray-300 text-sm">当前专题</span>
                  <span className={specialConfig.textColor.replace('text-', 'text-') + ' font-bold'}>{specialConfig.title}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="text-gray-600 dark:text-gray-300 text-sm">书籍总数</span>
                  <span className="text-green-500 font-bold">{pagination.total} 本</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="text-gray-600 dark:text-gray-300 text-sm">当前页</span>
                  <span className="text-purple-500 font-bold">{pagination.currentPage} / {pagination.totalPages}</span>
                </div>
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
            {/* 专题横幅 */}
            <div className={`${specialConfig.bgColor} rounded-lg p-6 mb-6 text-white transition-colors duration-300`}>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    {specialConfig.icon} {specialConfig.title}
                  </h1>
                  <p className="text-lg opacity-90">{specialConfig.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{pagination.total}</div>
                  <div className="text-sm opacity-90">本精品</div>
                </div>
              </div>
            </div>

            {/* 书籍列表 - 按行分组渲染，带横线分隔 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              {bookRows.length > 0 ? (
                <div className="space-y-2">
                  {bookRows.map((row, rowIndex) => (
                    <div key={rowIndex}>
                      {/* 一行书籍 */}
                      <div className="flex gap-2">
                        {row.map((book) => (
                          <BookCard 
                            key={book.id}
                            book={book}
                            layout="pc"
                          />
                        ))}
                      </div>
                      
                      {/* 横线分隔 (除了最后一行) */}
                      {rowIndex < bookRows.length - 1 && (
                        <div className="border-b border-gray-200 dark:border-gray-600"></div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                /* 空状态显示 */
                <div className="w-full">
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">{specialConfig.icon}</span>
                    </div>
                    <h4 className="text-gray-400 dark:text-gray-400 font-medium mb-2">暂无书籍</h4>
                    <p className="text-gray-500 dark:text-gray-500 text-sm">
                      该专题下暂时没有书籍，敬请期待更多精彩内容！
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 分页组件 - 使用 vant 的 Pagination */}
            {pagination.totalPages > 1 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-gray-600 dark:text-gray-300 text-sm">
                    显示第 {((pagination.currentPage - 1) * pagination.pageSize) + 1} - {Math.min(pagination.currentPage * pagination.pageSize, pagination.total)} 条，共 {pagination.total} 条记录
                  </div>
                </div>
                
                {/* 使用 vant 的 Pagination 组件 */}
                <Pagination 
                  value={pagination.currentPage}
                  onChange={onPageChange}
                  totalItems={pagination.total}
                  itemsPerPage={pagination.pageSize}
                  showPageSize={5}
                  forceEllipses={true}
                  className="pagination-custom"
                  prevText="上一页"
                  nextText="下一页"
                />
              </div>
            )}
          </main>
        </div>
      </div>
      
      {/* 加载状态 */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center shadow-2xl transition-colors duration-300">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            <div className="text-gray-900 dark:text-white text-lg font-bold">正在加载{specialConfig.title}数据...</div>
            <div className="text-gray-400 dark:text-gray-400 text-sm">请稍候，精彩即将呈现</div>
          </div>
        </div>
      )}
      
      {/* 错误状态 */}
      {error && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center shadow-2xl max-w-md transition-colors duration-300">
            <div className="text-6xl mb-4">😵</div>
            <h3 className="text-gray-900 dark:text-white text-xl font-bold mb-4">加载失败</h3>
            <p className="text-gray-400 dark:text-gray-400 mb-6">{error instanceof Error ? error.message : "网络连接出现问题"}</p>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-blue-500 hover:bg-blue-600 border-0"
            >
              🔄 重新加载
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
