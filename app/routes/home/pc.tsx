import { Button, Card, Badge } from "react-vant";
import { Clock, User, TrendingUp, Award, Heart, Eye, Star, Crown, BookMarked, Menu, Filter, BookOpen, RefreshCw, Flame, Library, BarChart3, Bookmark, Zap, Sparkles, Gem, Target, Medal } from "lucide-react";
import { Link, useNavigate } from "react-router";
import type { CategoryWithBooks } from "@/types/categorySearch";
import { useCategories, useHotBooks, formatHeat } from "./index";
import Navbar from "@/components/Navbar";
import { useChapterStore } from "@/store/useChapterStore";

export default function PC() {
  const navigate = useNavigate();
  const { currentChapterId, bookId } = useChapterStore();
  const { data: categories, isLoading, error } = useCategories();
  const { data: hotBooks } = useHotBooks();

  const handleContinueReading = () => {
    if (currentChapterId && bookId) {
      navigate(`/read/${bookId}/${currentChapterId}`);
    }
  };

  const hasReadingProgress = currentChapterId && bookId;
  const truncateDesc = (desc: string) => {
    if (!desc) return '';
    return desc.length > 100 ? desc.substring(0, 100) + '...' : desc;
  };

  const categoriesWithBooks = categories?.filter(cat => cat.books && cat.books.length > 0) || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <div className="max-w-7xl mx-auto pt-6 py-6">
        <div className="flex gap-4 lg:gap-6">
          <aside className="w-56 lg:w-64 flex-shrink-0">
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
                    className="block px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-white hover:bg-gray-700 dark:hover:bg-gray-700 rounded transition-colors cursor-pointer"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-gray-900 dark:text-white font-medium mb-3">快捷功能</h4>
                <div className="space-y-2">
                  <a href="#" className="block text-gray-400 dark:text-gray-400 hover:text-black text-sm">我的书架</a>
                  <a href="#" className="block text-gray-400 dark:text-gray-400 hover:text-black text-sm">阅读历史</a>
                  <a href="#" className="block text-gray-400 dark:text-gray-400 hover:text-black text-sm">收藏夹</a>
                </div>
              </div>
            </div>
          </aside>
          <main className="flex-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 lg:p-8 mb-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
                    <Library className="h-6 w-6 mr-2 text-blue-500" />
                    精品小说汇聚地
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 text-base lg:text-lg">
                    每晚22:00准时更新 · 千万书友共同选择
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-4 lg:gap-6 text-sm text-gray-400 dark:text-gray-400">
                    <span className="flex items-center">
                      <BarChart3 className="h-4 w-4 mr-1" />
                      <span>总藏书: <span className="text-gray-900 dark:text-white font-bold ml-1">500+</span> 本</span>
                    </span>
                    <span className="flex items-center">
                      <Library className="h-4 w-4 mr-1" />
                      <span>分类: <span className="text-gray-900 dark:text-white font-bold ml-1">{categoriesWithBooks.length}</span> 个</span>
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>在线: <span className="text-gray-900 dark:text-white font-bold ml-1">24H</span></span>
                    </span>
                  </div>
                </div>
                <div className="text-right hidden lg:block">
                  <Link to="/rank">
                    <div className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold text-lg hover:bg-blue-600 cursor-pointer transition-colors flex items-center justify-center">
                      <Flame className="h-5 w-5 mr-2" />
                      立即探索
                    </div>
                  </Link>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 lg:p-6 mb-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-900 dark:text-white font-bold text-lg lg:text-xl flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-yellow-500" />
                  编辑推荐
                </h3>
                <a href="#" className="text-blue-400 hover:text-blue-300 text-sm font-medium cursor-pointer">查看更多 →</a>
              </div>
              <div className="space-y-4">
                {categories && categories.slice(0, 2).map((category: CategoryWithBooks) => {
                  if (!category.books || category.books.length === 0) return null;
                  const featuredBook = category.books[0];
                  return (
                    <Card key={featuredBook.id} className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                      <Link to={`/book/${featuredBook.id}`}>
                        <Card.Body className="p-4">
                          <div className="flex space-x-3 lg:space-x-4">
                            {featuredBook.bookImage && (
                              <img
                                src={featuredBook.bookImage}
                                alt={featuredBook.name}
                                className="w-16 h-20 lg:w-20 lg:h-28 object-cover rounded flex-shrink-0"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDIwMCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NiA2NEw5MCA3Nkw5NCA2NEgxMTBMMTMyIDEyOEwxMDggMTQ0SDkwSDEwOEw5NCAxMTZMMTAwIDEwOEw5NiA5Nkg4NlpNMTI0IDExMkwxMjggMTIwUTEyNiAxMzAgMTIyIDEzMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+";
                                }}
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-gray-900 dark:text-white font-bold text-base lg:text-lg mb-1 line-clamp-2">
                                    {featuredBook.name}
                                  </h4>
                                  <Link to={`/author/${featuredBook.authorId}`}>
                                    <p className="text-gray-400 dark:text-gray-400 text-sm mb-2 flex items-center">
                                      <User className="h-4 w-4 mr-1" />
                                      {featuredBook.author}
                                    </p>
                                  </Link>
                                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                                    {truncateDesc(featuredBook.desc)}
                                  </p>
                                </div>
                                <div className="flex-shrink-0 ml-3 lg:ml-4 flex flex-col items-end">
                                  <span className="text-blue-400 text-xs font-medium block mb-2 flex items-center">
                                    <Flame className="h-3 w-3 mr-1" />
                                    {featuredBook.status}
                                  </span>
                                  <Button size="small" className="bg-blue-500 hover:bg-blue-600 border-0 text-xs px-3 cursor-pointer">
                                    立即阅读
                                  </Button>
                                </div>
                              </div>
                              {featuredBook.lastChapter && (
                                <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-600 rounded text-xs">
                                  <div className="text-gray-600 dark:text-gray-300 flex items-center">
                                    <BookOpen className="h-3 w-3 mr-1" />
                                    最新: {featuredBook.lastChapter}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </Card.Body>
                      </Link>
                    </Card>
                  );
                })}
              </div>
            </div>
          </main>
          <aside className="w-72 lg:w-80 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-4 flex items-center">
                <Crown className="h-5 w-5 mr-2 text-yellow-500" />
                <Flame className="h-5 w-5 mr-1 text-red-500" />
                畅销榜
              </h3>
              <div className="space-y-3">
                {hotBooks && hotBooks.map((book, index) => {
                  const rank = index + 1;
                  return (
                    <Link key={book.id} to={`/book/${book.id}`}>
                      <div className="flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded cursor-pointer transition-colors">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${rank === 1 ? 'bg-blue-500 text-white' : rank === 2 ? 'bg-indigo-500 text-white' : rank === 3 ? 'bg-purple-500 text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300'}`}>
                          {rank}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-gray-900 dark:text-white text-sm font-medium line-clamp-1">{book.name}</div>
                          <Link to={`/author/${book.authorId}`}>
                            <div className="text-gray-400 dark:text-gray-400 text-xs flex items-center">
                              <User className="h-3 w-3 mr-1" />
                              {book.author}
                            </div>
                          </Link>
                        </div>
                        <div className="text-blue-400 text-xs flex items-center flex-shrink-0">
                          <Flame className="h-3 w-3 mr-1 text-red-500" />
                          {formatHeat(book.fired)}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-4 flex items-center">
                <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                快捷操作
              </h3>
              <div className="space-y-2">
                <Button block className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white cursor-pointer">
                  <div className="flex items-center justify-center">
                    <Library className="h-4 w-4 mr-2" />
                    我的书架
                  </div>
                </Button>
                <Button block className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white cursor-pointer" onClick={handleContinueReading} disabled={!hasReadingProgress}>
                  <div className="flex items-center justify-center">
                    <BookOpen className="h-4 w-4 mr-2" />
                    继续阅读
                  </div>
                </Button>
                <Button block className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white cursor-pointer">
                  <div className="flex items-center justify-center">
                    <Bookmark className="h-4 w-4 mr-2" />
                    收藏夹
                  </div>
                </Button>
                <Button block className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white cursor-pointer">
                  <div className="flex items-center justify-center">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    阅读统计
                  </div>
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 lg:px-6 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-4 lg:p-6 shadow-lg">
          <div className="text-center">
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2 flex items-center justify-center">
              <Target className="h-6 w-6 mr-2" />
              精品分类推荐
            </h2>
            <p className="text-blue-100 text-base lg:text-lg">
              精心挑选各类优质小说，满足您的阅读需求
            </p>
            <div className="mt-4 flex flex-wrap justify-center items-center gap-4 lg:gap-6 text-sm text-blue-100">
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
      <div className="w-full">
        <div className="space-y-6 flex flex-wrap gap-4 lg:gap-6 px-4 lg:px-6">
          {categories && categories.map((category: CategoryWithBooks) => {
            const hasBooks = category.books && category.books.length > 0;
            return (
              <div key={category.id} className="bg-white dark:bg-gray-800 w-full lg:w-[calc(35.333%-1rem)] xl:w-[calc(33.333%-1.5rem)] 2xl:w-[calc(25%-1.5rem)] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <div className="bg-gray-100 dark:bg-gray-700 p-3 lg:p-4 border-l-4 border-blue-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-gray-900 dark:text-white font-bold text-lg lg:text-xl mb-1 flex items-center">
                        <Library className="h-5 w-5 mr-2 text-blue-500" />
                        {category.name}
                      </h3>
                      <p className="text-gray-400 dark:text-gray-400 text-sm">
                        {hasBooks ? (
                          <span className="flex items-center flex-wrap gap-1">
                            <Gem className="h-4 w-4 mr-1 text-purple-500" />
                            {category.books.length}本精品 · 
                            <Flame className="h-4 w-4 mx-1 text-red-500" />
                            火热更新 · 
                            <Star className="h-4 w-4 ml-1 text-yellow-500" />
                            品质保证
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <Target className="h-4 w-4 mr-1 text-blue-500" />
                            敬请期待更多精彩内容
                          </span>
                        )}
                      </p>
                    </div>
                    {hasBooks && (
                      <div className="flex space-x-2 flex-shrink-0">
                        <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                          <Flame className="h-3 w-3 mr-1" />
                          热门
                        </span>
                        <span className="bg-indigo-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                          <Sparkles className="h-3 w-3 mr-1" />
                          新书
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-3 lg:p-4">
                  {hasBooks ? (
                    <div className="space-y-3 lg:space-y-4">
                      {category.books.map((book, index) => (
                        <Link to={`/book/${book.id}`} key={book.id}>
                          <Card key={book.id} className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 hover:shadow-lg">
                            <Card.Body className="p-3 lg:p-4">
                              <div className="flex space-x-3 lg:space-x-4">
                                <div className="relative flex-shrink-0">
                                  {book.bookImage && (
                                    <img
                                      src={book.bookImage}
                                      alt={book.name}
                                      className="w-16 h-20 lg:w-20 lg:h-28 object-cover rounded"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDIwMCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NiA2NEw5MCA3Nkw5NCA2NEgxMTBMMTMyIDEyOEwxMDggMTQ0SDkwSDEwOEw5NCAxMTZMMTAwIDEwOEw5NiA5Nkg4NlpNMTI0IDExMkwxMjggMTIwUTEyNiAxMzAgMTIyIDEzMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+";
                                      }}
                                    />
                                  )}
                                  {index < 3 && (
                                    <div className="absolute -top-1 -left-1">
                                      <div className={`${index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-indigo-500' : 'bg-purple-500'} text-white px-2 py-1 rounded text-xs font-bold flex items-center`}>
                                        {index === 0 ? <Crown className="h-3 w-3 mr-1" /> : index === 1 ? <Medal className="h-3 w-3 mr-1" /> : <Award className="h-3 w-3 mr-1" />}
                                        TOP{index + 1}
                                      </div>
                                    </div>
                                  )}
                                  <div className="absolute -bottom-1 -right-1">
                                    <span className={`${book.status.includes('连载') ? 'bg-green-500' : 'bg-blue-500'} text-white px-2 py-1 rounded text-xs font-bold`}>
                                      {book.status}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                      <h4 className="text-gray-900 dark:text-white font-bold text-base lg:text-lg mb-2 line-clamp-2 leading-tight">
                                        {book.name}
                                      </h4>
                                      <Link to={`/author/${book.authorId}`}>
                                        <div className="flex items-center text-sm text-gray-400 dark:text-gray-400 mb-3">
                                          <User className="h-4 w-4 mr-1" />
                                          <span className="truncate">{book.author}</span>
                                        </div>
                                      </Link>
                                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                                        {truncateDesc(book.desc)}
                                      </p>
                                      {book.lastChapter && (
                                        <div className="mb-3 p-2 bg-gray-100 dark:bg-gray-600 rounded text-sm">
                                          <div className="text-gray-600 dark:text-gray-300 flex items-center">
                                            <BookOpen className="h-3 w-3 mr-1" />
                                            最新: {book.lastChapter}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex-shrink-0 ml-3 lg:ml-4 flex flex-col items-end space-y-2">
                                      <div className="flex items-center space-x-1">
                                        <Flame className="h-4 w-4 text-red-500" />
                                        <span className="text-sm text-gray-400 dark:text-gray-400">
                                          {formatHeat(book.fired!)}
                                        </span>
                                      </div>
                                      <Button size="small" className="bg-blue-500 hover:bg-blue-600 border-0 text-sm px-4 py-2 font-bold cursor-pointer">
                                        <div className="flex items-center justify-center">
                                          <BookOpen className="h-4 w-4 mr-1" />
                                          阅读
                                        </div>
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Card.Body>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 lg:py-12">
                      <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="h-6 w-6 lg:h-8 lg:w-8 text-gray-400 dark:text-gray-400" />
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
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center shadow-2xl transition-colors duration-300">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            <div className="text-gray-900 dark:text-white text-lg font-bold">正在加载精彩小说...</div>
            <div className="text-gray-400 dark:text-gray-400 text-sm">请稍候，好书即将呈现</div>
          </div>
        </div>
      )}
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
            <Button onClick={() => window.location.reload()} className="bg-blue-500 hover:bg-blue-600 border-0 cursor-pointer">
              <div className="flex items-center justify-center">
                <RefreshCw className="h-4 w-4 mr-2" />
                重新加载
              </div>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
