import { useState } from "react";
import { Button, Card, Badge } from "react-vant";
import { 
  BookOpen, Search, Clock, User, TrendingUp, Award, Heart, Eye, Star, 
  Crown, BookMarked, Menu, Filter, X, ChevronLeft, ChevronRight, MoreHorizontal,
  Library, Bookmark, BarChart3, Home, Zap, Target, Flame, ThumbsUp
} from "lucide-react";
import { useParams } from "react-router";
import type { Category } from "@/types/entities";
import type { BookInfo, PaginationInfo } from "@/types/categoryPage";
import { formatHeat } from "./index";
import BookCard from "@/components/BookCard";
import MobileNavbar from "@/components/MobileNavbar";

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
  const [showStatsPanel, setShowStatsPanel] = useState(false);
  const [sortType, setSortType] = useState<'latest' | 'popular' | 'favorite'>('latest');
  const { categoryId } = useParams();

  // 快捷操作处理
  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'bookshelf':
        // 跳转到书架页面
        window.location.href = '/bookshelf';
        break;
      case 'favorite':
        // 跳转到收藏页面
        window.location.href = '/favorite';
        break;
      case 'stats':
        // 跳转到阅读统计页面
        window.location.href = '/stats';
        break;
      case 'home':
        // 返回首页
        window.location.href = '/';
        break;
      default:
        break;
    }
  };

  // 筛选处理
  const handleSortChange = (type: 'latest' | 'popular' | 'favorite') => {
    setSortType(type);
    // 这里可以添加实际的筛选逻辑
    console.log(`切换到${type}排序`);
  };

  // 分类切换处理
  const handleCategorySelect = (category: Category) => {
    // 先关闭分类选择器
    setShowCategorySelector(false);
    
    // 延迟跳转，确保弹窗关闭动画完成
    setTimeout(() => {
      const targetPath = category.id === '' ? '/category' : `/category/${category.id}`;
      window.location.href = targetPath;
    }, 150);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* 统一的移动端导航栏 */}
      <MobileNavbar
        title="分类浏览"
        subtitle="发现更多精彩 · 精品小说"
        showBack={true}
        showSearch={true}
        onBackClick={() => window.history.back()}
      />

      {/* 分类选择器弹窗 */}
      {showCategorySelector && (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowCategorySelector(false)}></div>
          <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-lg max-h-[70vh] overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-900 dark:text-white font-bold text-lg">选择分类</h3>
                <button onClick={() => setShowCategorySelector(false)}>
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              </div>
              
              {/* 分类统计预览 */}
              <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-lg font-bold text-blue-500">{categories.length}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">分类总数</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-500">{pagination.total}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">书籍总数</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-purple-500">{pagination.totalPages}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">总页数</div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {categories && categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category)}
                    className={`p-3 rounded-lg text-center transition-colors block touch-target ${
                      (categoryId || '') === category.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <div className="font-medium">{category.name}</div>
                    {category.id && (
                      <div className="text-xs opacity-75 mt-1">
                        📚 精品分类
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 统计信息面板 */}
      {showStatsPanel && (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowStatsPanel(false)}></div>
          <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-lg max-h-[50vh] overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-900 dark:text-white font-bold text-lg">📊 分类统计</h3>
                <button onClick={() => setShowStatsPanel(false)}>
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">当前分类</h4>
                  <div className="text-2xl font-bold text-blue-500 mb-1">{currentCategory?.name || '全部'}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">正在浏览的分类</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-500 mb-1">{pagination.total}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">书籍总数</div>
                  </div>
                  
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-500 mb-1">{pagination.currentPage}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">当前页码</div>
                  </div>
                  
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-orange-500 mb-1">{pagination.totalPages}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">总页数</div>
                  </div>
                  
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-red-500 mb-1">{pagination.pageSize}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">每页数量</div>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">📈 浏览进度</h4>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(pagination.currentPage / pagination.totalPages) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    已浏览 {Math.round((pagination.currentPage / pagination.totalPages) * 100)}% 的内容
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="px-4 py-4">
        {/* 当前分类信息横幅 - 增强版 */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-lg p-6 mb-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">
                📚 {currentCategory?.name || '分类浏览'}
              </h2>
              <p className="text-sm opacity-90 mb-4">
                发现精彩小说 · 沉浸式阅读体验
              </p>
              <div className="flex items-center space-x-4 text-xs">
                <span className="bg-white/20 px-2 py-1 rounded">
                  当前: <span className="font-bold">{currentCategory?.name || '全部'}</span>
                </span>
                <span className="bg-white/20 px-2 py-1 rounded">
                  总数: <span className="font-bold">{pagination.total}</span>
                </span>
                <span className="bg-white/20 px-2 py-1 rounded">
                  页码: <span className="font-bold">{pagination.currentPage}/{pagination.totalPages}</span>
                </span>
              </div>
            </div>
            <div className="text-right space-y-2">
              <div 
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-bold text-sm transition-colors cursor-pointer touch-target"
                onClick={() => setShowCategorySelector(!showCategorySelector)}
              >
                 切换
              </div>
            </div>
          </div>
          
          {/* 快捷按钮 */}
          <div className="grid grid-cols-3 gap-3">
            <Button 
              block 
              className="bg-white/20 hover:bg-white/30 border-0 h-12 text-white text-sm touch-target backdrop-blur-sm"
              onClick={() => handleQuickAction('bookshelf')}
            >
              <Library className="h-4 w-4 mr-1" />
              书架
            </Button>
            <Button 
              block 
              className="bg-white/20 hover:bg-white/30 border-0 h-12 text-white text-sm touch-target backdrop-blur-sm"
              onClick={() => handleQuickAction('favorite')}
            >
              <Bookmark className="h-4 w-4 mr-1" />
              收藏
            </Button>
            <Button 
              block 
              className="bg-white/20 hover:bg-white/30 border-0 h-12 text-white text-sm touch-target backdrop-blur-sm"
              onClick={() => handleQuickAction('home')}
            >
              <Home className="h-4 w-4 mr-1" />
              首页
            </Button>
          </div>
        </div>

        {/* 筛选工具栏 - 增强版 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-900 dark:text-white font-bold text-lg">
              ✨ {currentCategory?.name || '分类'} 书籍
            </h3>
            <span className="text-sm text-gray-400 dark:text-gray-400">
              {pagination.total} 本精品
            </span>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <Button 
              size="small" 
              type={sortType === 'latest' ? 'primary' : 'default'}
              className={`touch-target ${
                sortType === 'latest' 
                  ? 'bg-blue-500 border-0 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white'
              }`}
              onClick={() => handleSortChange('latest')}
            >
              <Award className="h-4 w-4 mr-1" />
              最新
            </Button>
            <Button 
              size="small" 
              type={sortType === 'popular' ? 'primary' : 'default'}
              className={`touch-target ${
                sortType === 'popular' 
                  ? 'bg-blue-500 border-0 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white'
              }`}
              onClick={() => handleSortChange('popular')}
            >
              <TrendingUp className="h-4 w-4 mr-1" />
              热门
            </Button>
            <Button 
              size="small" 
              type={sortType === 'favorite' ? 'primary' : 'default'}
              className={`touch-target ${
                sortType === 'favorite' 
                  ? 'bg-blue-500 border-0 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white'
              }`}
              onClick={() => handleSortChange('favorite')}
            >
              <Heart className="h-4 w-4 mr-1" />
              收藏
            </Button>
          </div>
          
          {/* 排序说明 */}
          <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-400">
            {sortType === 'latest' && '📅 按发布时间排序，显示最新更新的小说'}
            {sortType === 'popular' && ' 按热度排序，优先显示热门小说'}
            {sortType === 'favorite' && '❤️ 按收藏量排序，显示最受喜爱的小说'}
          </div>
        </div>

        {/* 快捷功能区 - 增强版 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <h4 className="text-gray-900 dark:text-white font-bold text-lg mb-4 flex items-center">
            <Zap className="h-5 w-5 mr-2 text-blue-500" />
            ⚡ 快捷功能
          </h4>
          <div className="grid grid-cols-4 gap-3">
            <div 
              className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 cursor-pointer transition-colors touch-target"
              onClick={() => handleQuickAction('bookshelf')}
            >
              <Library className="h-6 w-6 mx-auto mb-2 text-blue-500" />
              <span className="text-xs text-gray-600 dark:text-gray-300 block">我的书架</span>
            </div>
            <div 
              className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 cursor-pointer transition-colors touch-target"
              onClick={() => handleQuickAction('favorite')}
            >
              <Bookmark className="h-6 w-6 mx-auto mb-2 text-purple-500" />
              <span className="text-xs text-gray-600 dark:text-gray-300 block">收藏夹</span>
            </div>
            <div 
              className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 cursor-pointer transition-colors touch-target"
              onClick={() => handleQuickAction('stats')}
            >
              <BarChart3 className="h-6 w-6 mx-auto mb-2 text-green-500" />
              <span className="text-xs text-gray-600 dark:text-gray-300 block">阅读统计</span>
            </div>
            <div 
              className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 cursor-pointer transition-colors touch-target"
              onClick={() => handleQuickAction('home')}
            >
              <Home className="h-6 w-6 mx-auto mb-2 text-orange-500" />
              <span className="text-xs text-gray-600 dark:text-gray-300 block">返回首页</span>
            </div>
          </div>
        </div>

        {/* 书籍列表 - 使用BookCard组件 */}
        <div className="space-y-4">
          {books.map((book, index) => (
            <BookCard 
              key={book.id}
              book={book}
              layout="mobile"
              showRank={true}
              rank={index}
              truncateLength={80}
            />
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

        {/* 分页组件 - 移动端增强版 */}
        {pagination.totalPages > 1 && (
          <Card className="mt-6 mb-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="text-gray-600 dark:text-gray-300 text-sm">
                  第 {pagination.currentPage} 页 / 共 {pagination.totalPages} 页
                </div>
                <div className="text-gray-600 dark:text-gray-300 text-sm">
                  共 {pagination.total} 本书
                </div>
              </div>
              
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Button 
                  size="small"
                  disabled={pagination.currentPage === 1}
                  onClick={() => onPageChange(pagination.currentPage - 1)}
                  className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white disabled:opacity-50 touch-target"
                >
                  <ChevronLeft className="h-4 w-4" />
                  上一页
                </Button>
                
                <span className="px-4 py-2 bg-blue-500 text-white rounded text-sm font-bold min-w-[3rem] text-center">
                  {pagination.currentPage}
                </span>
                
                <Button 
                  size="small"
                  disabled={pagination.currentPage === pagination.totalPages}
                  onClick={() => onPageChange(pagination.currentPage + 1)}
                  className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white disabled:opacity-50 touch-target"
                >
                  下一页
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              {/* 页码选择器 - 增强版 */}
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center text-xs text-gray-500 dark:text-gray-400 mb-3">
                  快速跳转
                </div>
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
                        className={`touch-target ${
                          pagination.currentPage === pageNum 
                            ? "bg-blue-500 border-0" 
                            : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white"
                        }`}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
              </div>
              
              {/* 进度条 */}
              <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(pagination.currentPage / pagination.totalPages) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  阅读进度: {Math.round((pagination.currentPage / pagination.totalPages) * 100)}%
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* 状态显示 */}
        {isLoading && (
          <Card className="mt-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <div className="p-8 text-center">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mr-3"></div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">正在加载书籍数据...</div>
                  <div className="text-sm text-gray-400 dark:text-gray-400">请稍候，好书即将呈现</div>
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
                className="bg-blue-500 hover:bg-blue-600 border-0 touch-target"
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
            <span className="flex items-center">
              <Target className="h-4 w-4 mr-1 text-orange-500" />
              精准
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
