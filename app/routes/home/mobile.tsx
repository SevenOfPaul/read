import { Button, Card, Badge } from "react-vant";
import { BookOpen, Search, Clock, User, TrendingUp, Award, Heart, Eye, Star, Crown, BookMarked, Filter, X } from "lucide-react";
import { Link, useNavigate } from "react-router";
import type { CategoryWithBooks } from "../../types/categorySearch";
import { useCategories, useHotBooks, formatHeat } from "./index";
import { useChapterStore } from "../../lib/useChapterStore";
import { useState } from "react";
import MobileNavbar from "../../components/MobileNavbar";

export default function Mobile() {
  const navigate = useNavigate();
  const { currentChapterId, bookId } = useChapterStore();
  const { data: categories, isLoading, error } = useCategories();
  const { data: hotBooks } = useHotBooks();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 继续阅读功能
  const handleContinueReading = () => {
    if (currentChapterId && bookId) {
      navigate(`/read/${bookId}/${currentChapterId}`);
    }
  };

  // 判断是否有阅读进度
  const hasReadingProgress = currentChapterId && bookId;
  console.log(currentChapterId,bookId)
  // 截取描述为100字
  const truncateDesc = (desc: string) => {
    if (!desc) return '';
    return desc.length > 100 ? desc.substring(0, 100) + '...' : desc;
  };

  // 统计数据
  const totalBooks = categories?.reduce((sum, cat) => sum + (cat.books?.length || 0), 0) || 0;
  const categoriesWithBooks = categories?.filter(cat => cat.books && cat.books.length > 0) || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* 统一的移动端导航栏 */}
      <MobileNavbar
        title="夜读小说网"
        subtitle="精品小说 · 夜夜精彩"
        showMenu={true}
        showSearch={true}
        onMenuClick={() => setIsSidebarOpen(true)}
      />

      {/* 移动端侧边栏 */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsSidebarOpen(false)}></div>
          <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-900 dark:text-white font-bold text-lg">作品分类</h3>
                <button onClick={() => setIsSidebarOpen(false)}>
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              </div>
              
              <div className="space-y-1 mb-6">
                {categories && categories.map((category: CategoryWithBooks) => (
                  <Link
                    key={category.id}
                    to={`/category/${category.id}`}
                    className="block px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-white hover:bg-gray-700 dark:hover:bg-gray-700 rounded transition-colors touch-target"
                  >
                    {category?.name || '未知分类'}
                  </Link>
                ))}
              </div>
              
              {/* 快捷功能 */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-gray-900 dark:text-white font-medium mb-3">快捷功能</h4>
                <div className="space-y-2">
                  <a href="#" className="block text-gray-400 dark:text-gray-400 hover:text-white text-sm touch-target">我的书架</a>
                  <a href="#" className="block text-gray-400 dark:text-gray-400 hover:text-white text-sm touch-target">阅读历史</a>
                  <a href="#" className="block text-gray-400 dark:text-gray-400 hover:text-white text-sm touch-target">收藏夹</a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}

      <div className="px-4 py-4">
        {/* 英雄横幅 - PC风格移动端适配 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                📚 精品小说汇聚地
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                每晚22:00准时更新 · 千万书友共同选择
              </p>
              <div className="flex items-center space-x-4 text-xs text-gray-400 dark:text-gray-400">
                <span>📊 总藏书: <span className="text-gray-900 dark:text-white font-bold">{totalBooks}</span> 本</span>
                <span>📂 分类: <span className="text-gray-900 dark:text-white font-bold">{categoriesWithBooks.length}</span> 个</span>
                <span>⏰ 在线: <span className="text-gray-900 dark:text-white font-bold">24H</span></span>
              </div>
            </div>
            <div className="text-right">
              <Link to="/rank">
                <div className="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-600 cursor-pointer transition-colors touch-target">
                  🔥 立即探索
                </div>
              </Link>
            </div>
          </div>
          
          {/* 快捷按钮 */}
          <div className="grid grid-cols-2 gap-3">
            <Button 
              block 
              type="primary"
              className="bg-blue-500 hover:bg-blue-600 border-0 h-12 text-white text-sm touch-target"
            >
              🔍 搜索小说
            </Button>
            <Button 
              block 
              className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white h-12 text-sm touch-target"
              onClick={handleContinueReading}
              disabled={!hasReadingProgress}
            >
              📝 继续阅读
            </Button>
          </div>
        </div>


        {/* 编辑推荐区域 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900 dark:text-white font-bold text-xl">✨ 编辑推荐</h3>
            <a href="#" className="text-blue-400 hover:text-blue-300 text-sm font-medium touch-target">查看更多 →</a>
          </div>
          
          <div className="space-y-4">
            {categories && categories.slice(0, 2).map((category: CategoryWithBooks) => {
              if (!category?.books || category.books.length === 0) return null;
              const featuredBook = category.books[0];
              
              return (
                <Card key={featuredBook?.id} className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors touch-target">
                  <Card.Body className="p-4">
                    <div className="flex space-x-3">
                      {featuredBook?.bookImage && (
                        <img 
                          src={featuredBook.bookImage} 
                          alt={featuredBook?.name || '书籍封面'}
                          className="w-16 h-20 object-cover rounded flex-shrink-0"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDIwMCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NiA2NEw5MCA3Nkw5NCA2NEgxMTBMMTMyIDEyOEwxMDggMTQ0SDkwSDEwOEw5NCAxMTZMMTAwIDEwOEw5NiA5Nkg4NlpNMTI0IDExMkwxMjggMTIwUTEyNiAxMzAgMTIyIDEzMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+";
                          }}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-gray-900 dark:text-white font-bold text-base mb-1 line-clamp-2">
                              {featuredBook?.name || '未知书名'}
                            </h4>
                            <Link to={`/author/${featuredBook?.authorId}`}>
                              <p className="text-gray-400 dark:text-gray-400 text-sm mb-2">👤 {featuredBook?.author || '未知作者'}</p>
                            </Link>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                              {truncateDesc(featuredBook?.desc || '')}
                            </p>
                          </div>
                          <div className="flex-shrink-0 ml-3">
                            <span className="text-blue-400 text-xs font-medium block mb-2">🔥 {featuredBook?.status || '状态未知'}</span>
                            <Link to={`/book/${featuredBook?.id}`}>
                              <Button size="small" className="bg-blue-500 hover:bg-blue-600 border-0 text-xs px-2 py-1 touch-target">
                                立即阅读
                              </Button>
                            </Link>
                          </div>
                        </div>
                        {featuredBook?.lastChapter && (
                          <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-600 rounded text-xs">
                            <div className="text-gray-600 dark:text-gray-300">📖 最新: {featuredBook.lastChapter}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              );
            })}
          </div>
        </div>

        {/* 功能按钮区 - 蓝色主题 */}
        <Card className="mb-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="p-4">
            <h4 className="text-gray-900 dark:text-white font-bold text-lg mb-4">⚡ 快捷功能</h4>
            <div className="grid grid-cols-4 gap-3">
              <div className="text-center touch-target">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-300">我的书架</span>
              </div>
              <Link to="/rank" className="text-center touch-target">
                <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-300">排行榜</span>
              </Link>
              <div className="text-center touch-target">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-300">收藏夹</span>
              </div>
              <div className="text-center touch-target">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <User className="h-6 w-6 text-white" />
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-300">个人中心</span>
              </div>
            </div>
          </div>
        </Card>

        {/* 精品分类推荐标题 */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-4 mb-6 shadow-lg">
          <div className="text-center">
            <h2 className="text-xl font-bold text-white mb-2">
              🎯 精品分类推荐
            </h2>
            <p className="text-blue-100 text-sm">
              精心挑选各类优质小说，满足您的阅读需求
            </p>
            <div className="mt-3 flex justify-center items-center space-x-4 text-xs text-blue-100">
              <span className="flex items-center">
                <Award className="h-3 w-3 mr-1" />
                品质保证
              </span>
              <span className="flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                热门推荐
              </span>
              <span className="flex items-center">
                <Heart className="h-3 w-3 mr-1" />
                精品内容
              </span>
            </div>
          </div>
        </div>

        {/* 分类展示区域 - PC风格移动端适配 */}
        <div className="space-y-6">
          {categories && categories.map((category: CategoryWithBooks) => {
            const hasBooks = category?.books && category.books.length > 0;
            
            return (
              <div key={category?.id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                {/* 分类头部 */}
                <div className="bg-gray-100 dark:bg-gray-700 p-4 border-l-4 border-blue-500">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-1">
                        📚 {category?.name || '未知分类'}
                      </h3>
                      <p className="text-gray-400 dark:text-gray-400 text-sm">
                        {hasBooks ? (
                          <>
                            💎 {category.books.length}本精品 · 🔥火热更新 · ⭐品质保证
                          </>
                        ) : (
                          '🎯 敬请期待更多精彩内容'
                        )}
                      </p>
                    </div>
                    {hasBooks && (
                      <div className="flex space-x-2">
                        <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          🔥 热门
                        </span>
                        <span className="bg-indigo-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          ✨ 新书
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 书籍列表 - 垂直布局 */}
                <div className="p-4">
                  {hasBooks ? (
                    <div className="space-y-3">
                      {category.books.map((book, index) => (
                        <Card key={book?.id} className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 hover:shadow-lg touch-target">
                          <Card.Body className="p-4">
                            <div className="flex space-x-3">
                              {/* 书籍封面 */}
                              <div className="relative flex-shrink-0">
                                {book?.bookImage && (
                                  <img 
                                    src={book.bookImage} 
                                    alt={book?.name || '书籍封面'}
                                    className="w-16 h-20 object-cover rounded"
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
                                  <span className={`${book?.status?.includes('连载') ? 'bg-green-500' : 'bg-blue-500'} text-white px-2 py-1 rounded text-xs font-bold`}>
                                    {book?.status || '状态未知'}
                                  </span>
                                </div>
                              </div>

                              {/* 书籍信息 */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-gray-900 dark:text-white font-bold text-base mb-2 line-clamp-2 leading-tight">
                                      {book?.name || '未知书名'}
                                    </h4>
                                    
                                    <div className="flex items-center text-sm text-gray-400 dark:text-gray-400 mb-3">
                                      <User className="h-4 w-4 mr-1" />
                                      <Link to={`/author/${book?.authorId}`} className="truncate hover:text-blue-400">
                                        {book?.author || '未知作者'}
                                      </Link>
                                    </div>

                                    {/* 书籍描述 - 限制100字 */}
                                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                                      {truncateDesc(book?.desc || '')}
                                    </p>

                                    {/* 最新章节 */}
                                    {book?.lastChapter && (
                                      <div className="mb-3 p-2 bg-gray-100 dark:bg-gray-600 rounded text-sm">
                                        <div className="text-gray-600 dark:text-gray-300">📖 最新: {book.lastChapter}</div>
                                      </div>
                                    )}
                                  </div>
                                  
                                  {/* 右侧操作区域 */}
                                  <div className="flex-shrink-0 ml-3 flex flex-col items-end space-y-2">
                                    <div className="flex items-center space-x-1">
                                      <Star className="h-4 w-4 text-yellow-500" />
                                      <span className="text-sm text-gray-400 dark:text-gray-400">9.2</span>
                                    </div>
                                    <Link to={`/book/${book?.id}`}>
                                      <Button 
                                        size="small"
                                        className="bg-blue-500 hover:bg-blue-600 border-0 text-sm px-3 py-1 font-bold touch-target"
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
                    </div>
                  ) : (
                    /* 空分类状态 */
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="h-8 w-8 text-gray-400 dark:text-gray-400" />
                      </div>
                      <h4 className="text-gray-400 dark:text-gray-400 font-medium mb-2">精彩即将呈现</h4>
                      <p className="text-gray-500 dark:text-gray-500 text-sm">
                        我们正在精心策划优质的{category?.name || '该分类'}小说内容，敬请期待！
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 移动端特色说明 - 蓝色主题 */}
        <Card className="mt-6 mb-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="p-4">
            <h4 className="font-bold text-gray-900 dark:text-white mb-4 text-center">🔥 为什么选择夜读小说网？</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg touch-target">
                <span className="flex items-center text-gray-600 dark:text-gray-300">
                  <Award className="h-5 w-5 mr-3 text-blue-500" />
                  精选优质内容
                </span>
                <span className="text-blue-500 font-bold">✓</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg touch-target">
                <span className="flex items-center text-gray-600 dark:text-gray-300">
                  <TrendingUp className="h-5 w-5 mr-3 text-green-500" />
                  每日持续更新
                </span>
                <span className="text-green-500 font-bold">✓</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg touch-target">
                <span className="flex items-center text-gray-600 dark:text-gray-300">
                  <Heart className="h-5 w-5 mr-3 text-purple-500" />
                  个性化推荐
                </span>
                <span className="text-purple-500 font-bold">✓</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg touch-target">
                <span className="flex items-center text-gray-600 dark:text-gray-300">
                  <Star className="h-5 w-5 mr-3 text-yellow-500" />
                  无广告阅读
                </span>
                <span className="text-yellow-500 font-bold">✓</span>
              </div>
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
                  <div className="font-medium text-gray-900 dark:text-white">正在加载精彩小说...</div>
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
                className="bg-blue-500 hover:bg-blue-600 border-0 touch-target"
                onClick={() => window.location.reload()}
              >
                🔄 重新加载
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* 移动端底部信息 - 蓝色主题 */}
      <footer className="bg-gray-800 dark:bg-gray-800 border-t border-gray-700 dark:border-gray-700 py-8 mt-8 transition-colors duration-300">
        <div className="px-4 text-center">
          <h4 className="font-bold text-white mb-3 text-lg">📚 夜读小说网</h4>
          <p className="text-sm text-gray-400 dark:text-gray-400 mb-4">发现更多精彩故事 · 享受沉浸式阅读时光</p>
          <div className="flex justify-center space-x-6 text-sm text-gray-500 dark:text-gray-500 mb-4">
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
              <Star className="h-4 w-4 mr-1 text-yellow-500" />
              体验
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
