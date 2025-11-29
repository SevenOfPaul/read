import { useState } from "react";
import { Button, Card, Badge } from "react-vant";
import { 
  BookOpen, Search, Clock, User, TrendingUp, Award, Heart, Eye, Star, 
  Crown, BookMarked, Menu, Filter, X, ChevronLeft, ChevronRight, MoreHorizontal 
} from "lucide-react";
import { Link, useParams } from "react-router";
import type { Category } from "@/types/entities";
import type { BookInfo, PaginationInfo } from "@/types/categoryPage";
import { formatHeat } from "./index";

interface CategoryPageProps {
  categories: Category[];
  currentCategory?: Category;
  books: BookInfo[];
  pagination: PaginationInfo;
  isLoading: boolean;
  error?: Error;
  onPageChange: (page: number) => void;
}

export default function Mobile({
  categories,
  currentCategory,
  books,
  pagination,
  isLoading,
  error,
  onPageChange
}: CategoryPageProps) {
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const { categoryId } = useParams();

  // 截取描述为80字
  const truncateDesc = (desc: string) => {
    if (!desc) return '';
    return desc.length > 80 ? desc.substring(0, 80) + '...' : desc;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* 顶部导航栏 */}
      <nav className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200 sticky top-0 z-50 transition-colors duration-300">
        <div className="px-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900 dark:text-white">分类浏览</h1>
                  <p className="text-xs text-gray-400 dark:text-gray-400">发现更多精彩 · 精品小说</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-white hover:bg-gray-700 dark:hover:bg-gray-700 rounded-lg transition-colors"
                onClick={() => setShowCategorySelector(!showCategorySelector)}
              >
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 分类选择器弹窗 */}
      {showCategorySelector && (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowCategorySelector(false)}></div>
          <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-lg max-h-[60vh] overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-900 dark:text-white font-bold text-lg">选择分类</h3>
                <button onClick={() => setShowCategorySelector(false)}>
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {categories && categories.map((category) => (
                  <Link
                    key={category.id}
                    to={category.id === '' ? '/category' : `/category/${category.id}`}
                    className={`p-3 rounded-lg text-center transition-colors block ${
                      (categoryId || '') === category.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="px-4 py-4">
        {/* 当前分类信息横幅 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                📚 {currentCategory?.name || '分类浏览'}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                发现精彩小说 · 沉浸式阅读体验
              </p>
              <div className="flex items-center space-x-4 text-xs text-gray-400 dark:text-gray-400">
                <span>📚 当前: <span className="text-gray-900 dark:text-white font-bold">{currentCategory?.name || '全部'}</span></span>
                <span>📊 总数: <span className="text-gray-900 dark:text-white font-bold">{pagination.total}</span></span>
                <span>📄 页码: <span className="text-gray-900 dark:text-white font-bold">{pagination.currentPage}</span></span>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-600 cursor-pointer transition-colors">
                🔥 精选
              </div>
            </div>
          </div>
          
          {/* 快捷按钮 */}
          <div className="grid grid-cols-2 gap-3">
            <Button 
              block 
              type="primary"
              className="bg-blue-500 hover:bg-blue-600 border-0 h-10 text-white text-sm"
            >
              🔍 搜索小说
            </Button>
            <Button 
              block 
              className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white h-10 text-sm"
            >
              📚 查看书架
            </Button>
          </div>
        </div>

        {/* 筛选工具栏 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-900 dark:text-white font-bold text-lg">
              ✨ {currentCategory?.name || '分类'} 书籍
            </h3>
            <span className="text-sm text-gray-400 dark:text-gray-400">
              {pagination.total} 本
            </span>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <Button size="small" className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white">
              <Award className="h-4 w-4 mr-1" />
              最新
            </Button>
            <Button size="small" className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white">
              <TrendingUp className="h-4 w-4 mr-1" />
              热门
            </Button>
            <Button size="small" className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white">
              <Heart className="h-4 w-4 mr-1" />
              收藏
            </Button>
          </div>
        </div>

        {/* 书籍列表 - 移动端垂直布局 */}
        <div className="space-y-4">
          {books.map((book, index) => (
            <Card key={book.id} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-all duration-200 hover:shadow-lg">
              <Card.Body className="p-4">
                <div className="flex space-x-4">
                  {/* 书籍封面 */}
                  <div className="relative flex-shrink-0">
                    {book.bookImage && (
                      <img 
                        src={book.bookImage} 
                        alt={book.name}
                        className="w-20 h-28 object-cover rounded"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDIwMCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NiA2NEw5MCA3Nkw5NCA2NEgxMTBMMTMyIDEyOEwxMDggMTQ0SDkwSDEwOEw5NCAxMTZMMTAwIDEwOEw5NiA5Nkg4NlpNMTI0IDExMkwxMjggMTIwUTEyNiAxMzAgMTIyIDEzMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+";
                        }}
                      />
                    )}
                    
                    {/* 排名徽章 */}
                    {index < 3 && (
                      <div className="absolute -top-1 -left-1">
                        <div className={`${index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-indigo-500' : 'bg-purple-500'} text-white px-2 py-1 rounded text-xs font-bold flex items-center`}>
                          {index === 0 ? '👑' : index === 1 ? '🥈' : '🥉'} TOP{index + 1}
                        </div>
                      </div>
                    )}
                    
                    {/* 状态标签 */}
                    <div className="absolute -bottom-1 -right-1">
                      <span className={`${book.status.includes('连载') ? 'bg-green-500' : 'bg-blue-500'} text-white px-2 py-1 rounded text-xs font-bold`}>
                        {book.status}
                      </span>
                    </div>
                  </div>

                  {/* 书籍信息 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-gray-900 dark:text-white font-bold text-base mb-2 line-clamp-2 leading-tight">
                          {book.name}
                        </h4>
                        
                        <div className="flex items-center text-sm text-gray-400 dark:text-gray-400 mb-3">
                          <User className="h-4 w-4 mr-1" />
                          <span className="truncate">{book.author}</span>
                        </div>

                        {/* 书籍描述 - 移动端限制 */}
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                          {truncateDesc(book.desc)}
                        </p>

                        {/* 最新章节 */}
                        {book.lastChapter && (
                          <div className="mb-3 p-2 bg-gray-100 dark:bg-gray-600 rounded text-sm">
                            <div className="text-gray-600 dark:text-gray-300">📖 最新: {book.lastChapter}</div>
                          </div>
                        )}

                        {/* 热度标签 */}
                        {book.fired && (
                          <div className="mb-3">
                            <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                              {formatHeat(book.fired)}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* 右侧操作区域 */}
                      <div className="flex-shrink-0 ml-3 flex flex-col items-end space-y-2">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm text-gray-400 dark:text-gray-400">9.2</span>
                        </div>
                        <Link to={`/book/${book.id}`}>
                          <Button 
                            size="small"
                            className="bg-blue-500 hover:bg-blue-600 border-0 text-sm px-3 py-1 font-bold"
                          >
                            📖 阅读
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}

          {/* 空状态显示 */}
          {books.length === 0 && !isLoading && (
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-gray-400 dark:text-gray-400" />
                </div>
                <h4 className="text-gray-400 dark:text-gray-400 font-medium mb-2">暂无书籍</h4>
                <p className="text-gray-500 dark:text-gray-500 text-sm">
                  该分类下暂时没有书籍，敬请期待更多精彩内容！
                </p>
              </div>
            </Card>
          )}
        </div>

        {/* 分页组件 - 移动端简化版 */}
        {pagination.totalPages > 1 && (
          <Card className="mt-6 mb-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-gray-600 dark:text-gray-300 text-sm">
                  第 {pagination.currentPage} 页 / 共 {pagination.totalPages} 页
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button 
                    size="small"
                    disabled={pagination.currentPage === 1}
                    onClick={() => onPageChange(pagination.currentPage - 1)}
                    className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <span className="px-3 py-1 bg-blue-500 text-white rounded text-sm font-bold">
                    {pagination.currentPage}
                  </span>
                  
                  <Button 
                    size="small"
                    disabled={pagination.currentPage === pagination.totalPages}
                    onClick={() => onPageChange(pagination.currentPage + 1)}
                    className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white disabled:opacity-50"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* 页码选择器 */}
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-5 gap-2">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.currentPage >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = pagination.currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        size="small"
                        type={pagination.currentPage === pageNum ? "primary" : "default"}
                        onClick={() => onPageChange(pageNum)}
                        className={pagination.currentPage === pageNum 
                          ? "bg-blue-500 border-0" 
                          : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white"
                        }
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* 快捷功能区 */}
        <Card className="mb-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="p-4">
            <h4 className="text-gray-900 dark:text-white font-bold text-lg mb-4">⚡ 快捷功能</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition-colors">
                <BookOpen className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                <span className="text-xs text-gray-600 dark:text-gray-300">我的书架</span>
              </div>
              <Link to="/" className="text-center p-3 bg-blue-50 dark:bg-blue-900 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 cursor-pointer transition-colors">
                <Crown className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                <span className="text-xs text-gray-600 dark:text-gray-300">返回首页</span>
              </Link>
            </div>
          </div>
        </Card>

        {/* 状态显示 */}
        {isLoading && (
          <Card className="mt-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <div className="p-8 text-center">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mr-3"></div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">正在加载书籍数据...</div>
                  <div className="text-sm text-gray-400 dark:text-gray-400">请稍候</div>
                </div>
              </div>
            </div>
          </Card>
        )}
        
        {error && (
          <Card className="mt-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <div className="p-8 text-center">
              <div className="text-blue-400 mb-4">
                <div className="text-4xl mb-2">😵</div>
                <div className="font-medium text-gray-900 dark:text-white">加载失败</div>
                <div className="text-sm text-gray-400 dark:text-gray-400">
                  {error instanceof Error ? error.message : "未知错误"}
                </div>
              </div>
              <Button 
                type="primary"
                size="small"
                className="bg-blue-500 hover:bg-blue-600 border-0"
                onClick={() => window.location.reload()}
              >
                🔄 重新加载
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* 移动端底部信息 */}
      <footer className="bg-gray-800 dark:bg-gray-800 border-t border-gray-700 dark:border-gray-700 py-6 mt-8 transition-colors duration-300">
        <div className="px-4 text-center">
          <h4 className="font-bold text-white mb-3 text-lg">📚 分类浏览</h4>
          <p className="text-sm text-gray-400 dark:text-gray-400 mb-4">探索更多精彩分类 · 发现优质小说</p>
          <div className="flex justify-center space-x-4 text-sm text-gray-500 dark:text-gray-500 mb-4">
            <span className="flex items-center">
              <Award className="h-4 w-4 mr-1 text-blue-500" />
              品质
            </span>
            <span className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
              更新
            </span>
            <span className="flex items-center">
              <Heart className="h-4 w-4 mr-1 text-purple-500" />
              推荐
            </span>
          </div>
          <div className="border-t border-gray-700 dark:border-gray-700 pt-4">
            <p className="text-xs text-gray-500 dark:text-gray-500">
              © 2025 夜读小说网 · 专业的在线阅读平台
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
