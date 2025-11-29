import { Button, Card, Badge } from "react-vant";
import { Clock, User, TrendingUp, Award, Heart, Eye, Star, Crown, BookMarked, Menu, Filter, BookOpen } from "lucide-react";
import { Link } from "react-router";
import type { CategoryWithBooks } from "@/types/categorySearch";
import { useCategories, useHotBooks, formatHeat } from "./index";
import Navbar from "@/components/Navbar";

export default function PC() {
  const { data: categories, isLoading, error } = useCategories();
  const { data: hotBooks } = useHotBooks();

  // 截取描述为100字
  const truncateDesc = (desc: string) => {
    if (!desc) return '';
    return desc.length > 100 ? desc.substring(0, 100) + '...' : desc;
  };

  // 统计数据
  const totalBooks = categories?.reduce((sum, cat) => sum + (cat.books?.length || 0), 0) || 0;
  const categoriesWithBooks = categories?.filter(cat => cat.books && cat.books.length > 0) || [];
  console.log(categoriesWithBooks)
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* 使用公共导航栏组件 */}
      <Navbar />

      <div className="max-w-7xl mx-auto pt-6 py-6">
        <div className="flex gap-6">
          {/* 左侧边栏 - 分类导航 */}
          <aside className="w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-900 dark:text-white font-bold text-lg">作品分类</h3>
                <Filter className="h-4 w-4 text-gray-400 dark:text-gray-400" />
              </div>

              <div className="space-y-1">
                {categories && categories.map((category: CategoryWithBooks) => (
                  <Link
                    key={category.id}
                    to={`/category/${category.id}`}
                    className="block px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-white hover:bg-gray-700 dark:hover:bg-gray-700 rounded transition-colors"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>

              {/* 快捷功能 */}
              <div className="mt-6 pt-4 border-t border-gray-700">
                <h4 className="text-gray-900 dark:text-white font-medium mb-3">快捷功能</h4>
                <div className="space-y-2">
                  <a href="#" className="block text-gray-400 dark:text-gray-400 hover:text-black text-sm">我的书架</a>
                  <a href="#" className="block text-gray-400 dark:text-gray-400 hover:text-black text-sm">阅读历史</a>
                  <a href="#" className="block text-gray-400 dark:text-gray-400 hover:text-black text-sm">收藏夹</a>
                </div>
              </div>
            </div>
          </aside>

          {/* 主内容区域 */}
          <main className="flex-1">
            {/* 英雄横幅 - 起点风格 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 mb-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    📚 精品小说汇聚地
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 text-lg">
                    每晚22:00准时更新 · 千万书友共同选择
                  </p>
                  <div className="mt-4 flex items-center space-x-6 text-sm text-gray-400 dark:text-gray-400">
                    <span>📊 总藏书: <span className="text-gray-900 dark:text-white font-bold">{totalBooks}</span> 本</span>
                    <span>📂 分类: <span className="text-gray-900 dark:text-white font-bold">{categoriesWithBooks.length}</span> 个</span>
                    <span>⏰ 在线: <span className="text-gray-900 dark:text-white font-bold">24H</span></span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold text-lg hover:bg-blue-600 cursor-pointer transition-colors">
                    🔥 立即探索
                  </div>
                </div>
              </div>
            </div>

            {/* 编辑推荐区域 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-900 dark:text-white font-bold text-xl">✨ 编辑推荐</h3>
                <a href="#" className="text-blue-400 hover:text-blue-300 text-sm font-medium">查看更多 →</a>
              </div>

              <div className="space-y-4">
                {categories && categories.slice(0, 2).map((category: CategoryWithBooks) => {
                  if (!category.books || category.books.length === 0) return null;
                  const featuredBook = category.books[0];

                  return (
                    <Card key={featuredBook.id} className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                      <Card.Body className="p-4">
                        <div className="flex space-x-4">
                          {featuredBook.bookImage && (
                            <img
                              src={featuredBook.bookImage}
                              alt={featuredBook.name}
                              className="w-20 h-28 object-cover rounded flex-shrink-0"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDIwMCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NiA2NEw5MCA3Nkw5NCA2NEgxMTBMMTMyIDEyOEwxMDggMTQ0SDkwSDEwOEw5NCAxMTZMMTAwIDEwOEw5NiA5Nkg4NlpNMTI0IDExMkwxMjggMTIwUTEyNiAxMzAgMTIyIDEzMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+";
                              }}
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <h4 className="text-gray-900 dark:text-white font-bold text-lg mb-1 line-clamp-2">
                                  {featuredBook.name}
                                </h4>
                                <Link to={`/author/${featuredBook.authorId}`}>
                                  <p className="text-gray-400 dark:text-gray-400 text-sm mb-2">👤 {featuredBook.author}</p></Link>
                                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                                  {truncateDesc(featuredBook.desc)}
                                </p>
                              </div>
                              <div className="flex-shrink-0 ml-4">
                                <span className="text-blue-400 text-xs font-medium block mb-2">🔥 {featuredBook.status}</span>
                                <Link to={`/book/${featuredBook.id}`}>
                                  <Button size="small" className="bg-blue-500 hover:bg-blue-600 border-0 text-xs px-3">
                                    立即阅读
                                  </Button>
                                </Link>
                              </div>
                            </div>
                            {featuredBook.lastChapter && (
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
          </main>

          {/* 右侧边栏 - 排行榜和推荐 */}
          <aside className="w-80 flex-shrink-0">
            {/* 畅销榜 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-4 flex items-center">
                <Crown className="h-5 w-5 mr-2 text-yellow-500" />
                🔥 畅销榜
              </h3>
              <div className="space-y-3">
                {
                 hotBooks&&hotBooks.map((book, index) => {
                    const rank = index + 1;
                    return (
                      <Link key={book.id} to={`/book/${book.id}`}>
                        <div className="flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded cursor-pointer transition-colors">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${rank === 1 ? 'bg-blue-500 text-white' :
                            rank === 2 ? 'bg-indigo-500 text-white' :
                              rank === 3 ? 'bg-purple-500 text-white' :
                                'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                            }`}>
                            {rank}
                          </div>
                          <div className="flex-1">
                            <div className="text-gray-900 dark:text-white text-sm font-medium line-clamp-1">{book.name}</div>
                            <Link to={`/author/${book.authorId}`}> <div className="text-gray-400 dark:text-gray-400 text-xs">👤 {book.author}</div></Link>
                          </div>
                          <div className="text-blue-400 text-xs">{formatHeat(book.fired)}</div>
                        </div>
                      </Link>
                    );
                  })
                }
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
              </div>
            </div>
          </aside>
        </div>


      </div>

      {/* 分类推荐标题 */}
      <div className="max-w-7xl mx-auto px-6 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-6 shadow-lg">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-2">
              🎯 精品分类推荐
            </h2>
            <p className="text-blue-100 text-lg">
              精心挑选各类优质小说，满足您的阅读需求
            </p>
            <div className="mt-4 flex justify-center items-center space-x-6 text-sm text-blue-100">
              <span className="flex items-center">
                <Award className="h-4 w-4 mr-1" />
                品质保证
              </span>
              <span className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                热门推荐
              </span>
              <span className="flex items-center">
                <Heart className="h-4 w-4 mr-1" />
                精品内容
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* 分类展示区域 - 独立满宽部分 */}
      <div className="w-full">
        <div className="space-y-6 flex flex-row flex-wrap gap-4 px-6">
          {categories && categories.map((category: CategoryWithBooks) => {
            const hasBooks = category.books && category.books.length > 0;

            return (
              <div key={category.id} className="bg-white 
                 dark:bg-gray-800 w-162 rounded-lg overflow-hidden border border-gray-200 
                 dark:border-gray-700 transition-colors duration-300">
                {/* 分类头部 */}
                <div className="bg-gray-100 dark:bg-gray-700 p-4 border-l-4 border-blue-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-gray-900 dark:text-white font-bold text-xl mb-1">
                        📚 {category.name}
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
                        <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                          🔥 热门
                        </span>
                        <span className="bg-indigo-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                          ✨ 新书
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 书籍列表 */}
                <div className="p-4">
                  {hasBooks ? (
                    <div className="space-y-4">
                      {category.books.map((book, index) => (
                        <Card key={book.id} className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 hover:shadow-lg">
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
                                    <h4 className="text-gray-900 dark:text-white font-bold text-lg mb-2 line-clamp-2 leading-tight">
                                      {book.name}
                                    </h4>
                                    <Link to={`/author/${book.authorId}`}>
                                      <div className="flex items-center text-sm text-gray-400 dark:text-gray-400 mb-3">
                                        <User className="h-4 w-4 mr-1" />
                                        <span className="truncate">{book.author}</span>
                                      </div>
                                    </Link>
                                    {/* 书籍描述 - 限制100字 */}
                                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                                      {truncateDesc(book.desc)}
                                    </p>

                                    {/* 最新章节 */}
                                    {book.lastChapter && (
                                      <div className="mb-3 p-2 bg-gray-100 dark:bg-gray-600 rounded text-sm">
                                        <div className="text-gray-600 dark:text-gray-300">📖 最新: {book.lastChapter}</div>
                                      </div>
                                    )}
                                  </div>

                                  {/* 右侧操作区域 */}
                                  <div className="flex-shrink-0 ml-4 flex flex-col items-end space-y-2">
                                    <div className="flex items-center space-x-1">
                                      <span className="text-sm text-gray-400 dark:text-gray-400">
                                        {formatHeat(book.fired!)}
                                      </span>
                                    </div>
                                    <Link to={`/book/${book.id}`}>
                                      <Button
                                        size="small"
                                        className="bg-blue-500 hover:bg-blue-600 border-0 text-sm px-4 py-2 font-bold"
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
                        我们正在精心策划优质的{category.name}小说内容，敬请期待！
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* 加载状态 */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center shadow-2xl transition-colors duration-300">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            <div className="text-gray-900 dark:text-white text-lg font-bold">正在加载精彩小说...</div>
            <div className="text-gray-400 dark:text-gray-400 text-sm">请稍候，好书即将呈现</div>
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
