import { Button, Card, Badge } from "react-vant";
import { Link, useParams } from "react-router";
import type { Category } from "@/types/entities";
import type { BookInfo, PaginationInfo } from "@/types/categoryPage";
import Navbar from "@/components/Navbar";
import BookCard from "@/components/BookCard";
import { Pagination } from "@/components/ui/pagination";
import { Settings, BarChart3, Library, Bookmark, BarChart2, Home, RefreshCw, BookOpen, Sparkles } from "lucide-react";

interface CategoryPageProps {
  categories: Category[];
  currentCategory?: Category;
  books: BookInfo[];
  pagination: PaginationInfo;
  isLoading: boolean;
  error?: Error;
  onPageChange: (page: number) => void;
}

export default function PC({
  categories,
  currentCategory,
  books,
  pagination,
  isLoading,
  error,
  onPageChange
}: CategoryPageProps) {
  const { categoryId } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* 使用公共导航栏组件 */}
      <Navbar />

      <div className="max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* 左侧边栏 - 分类导航 */}
          <aside className="w-full lg:w-56 xl:w-64 flex-shrink-0 flex gap-2 flex-col space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-900 dark:text-white font-bold text-lg">作品分类</h3>
                <Settings className="h-4 w-4 text-gray-400 dark:text-gray-400" />
              </div>
              
              <div className="space-y-1">
                {categories && categories.map((category) => (
                  <Link
                    key={category.id}
                    to={category.id === '' ? "/category/''" : `/category/${category.id}`}
                    className={`block cursor-pointer px-3 py-2 rounded transition-colors text-sm ${
                      (categoryId || '') === category.id
                        ? 'text-white bg-blue-500'
                        : 'text-gray-600 dark:text-gray-300 hover:text-white hover:bg-gray-700 dark:hover:bg-gray-700'
                    }`}
                  >
                    {category.name }
                  </Link>
                ))}
              </div>
              
            </div>
            
            {/* 分类统计 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
                分类统计
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="text-gray-600 dark:text-gray-300 text-sm">当前分类</span>
                  <span className="text-blue-500 font-bold text-sm">{currentCategory?.name || '全部'}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="text-gray-600 dark:text-gray-300 text-sm">书籍总数</span>
                  <span className="text-green-500 font-bold text-sm">{pagination.total} 本</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="text-gray-600 dark:text-gray-300 text-sm">当前页</span>
                  <span className="text-purple-500 font-bold text-sm">{pagination.currentPage} / {pagination.totalPages}</span>
                </div>
              </div>
            </div>

            {/* 快捷操作 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-4 flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-yellow-500" />
                快捷操作
              </h3>
              <div className="space-y-2">
                <Button block className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white text-sm">
                  <Library className="h-4 w-4 mr-2" />
                  我的书架
                </Button>
                <Button block className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white text-sm">
                  <Bookmark className="h-4 w-4 mr-2" />
                  收藏夹
                </Button>
                <Button block className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white text-sm">
                  <BarChart2 className="h-4 w-4 mr-2" />
                  阅读统计
                </Button>
                <Link to="/">
                  <Button block className="bg-blue-500 hover:bg-blue-600 border-0 text-white text-sm">
                    <Home className="h-4 w-4 mr-2" />
                    返回首页
                  </Button>
                </Link>
              </div>
            </div>
          </aside>

          {/* 主内容区域 */}
          <main className="flex-1">
            {/* 分类横幅 */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4 sm:p-6 mb-6 text-white transition-colors duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center">
                    <Library className="h-6 w-6 mr-2" />
                    {currentCategory?.name || '全部分类'}
                  </h1>
                  <p className="text-sm sm:text-lg opacity-90">发现更多精彩内容 · 尽在夜读小说网</p>
                </div>
                <div className="text-center sm:text-right">
                  <div className="text-2xl sm:text-3xl font-bold">{pagination.total}</div>
                  <div className="text-sm opacity-90">本精品</div>
                </div>
              </div>
            </div>

            {/* 书籍列表 - Flex布局 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 border
             border-gray-200 dark:border-gray-700 transition-colors duration-300">
              {books.length > 0 ? (
                <div className="flex flex-wrap gap-3 lg:gap-4">
                  {books.map((book) => (
                    <div key={book.id} className="w-full sm:w-[45%] lg:w-[45%] xl:w-[48%]">
                      <BookCard 
                        book={book}
                        layout="pc"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                /* 空状态显示 */
                <div className="w-full">
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="h-8 w-8 text-gray-400 dark:text-gray-400" />
                    </div>
                    <h4 className="text-gray-400 dark:text-gray-400 font-medium mb-2">暂无书籍</h4>
                    <p className="text-gray-500 dark:text-gray-500 text-sm">
                      该分类下暂时没有书籍，敬请期待更多精彩内容！
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 分页组件 - 使用 shadcn 的 Pagination */}
            {pagination.totalPages > 1 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
                    显示第 {((pagination.currentPage - 1) * pagination.pageSize) + 1} - {Math.min(pagination.currentPage * pagination.pageSize, pagination.total)} 条，共 {pagination.total} 条记录
                  </div>
                </div>
                
                {/* 使用 shadcn 的 Pagination 组件 */}
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
            <div className="text-gray-900 dark:text-white text-lg font-bold">正在加载书籍数据...</div>
            <div className="text-gray-400 dark:text-gray-400 text-sm">请稍候，好书即将呈现</div>
          </div>
        </div>
      )}
      
      {/* 错误状态 */}
      {error && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center shadow-2xl max-w-md transition-colors duration-300">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <Sparkles className="h-12 w-12 text-red-500 mx-auto" />
              </div>
            </div>
            <h3 className="text-gray-900 dark:text-white text-xl font-bold mb-4">加载失败</h3>
            <p className="text-gray-400 dark:text-gray-400 mb-6">{error instanceof Error ? error.message : "网络连接出现问题"}</p>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-blue-500 hover:bg-blue-600 border-0"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              重新加载
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
