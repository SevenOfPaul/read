import { Button, Card } from "react-vant";
import { BookOpen, User, TrendingUp, Award, Heart, Star, Crown, Grid, RefreshCw, Flame, Library, BarChart3, Search, Zap, Sparkles, Gem, Target, Medal } from "lucide-react";
import { Link, useNavigate } from "react-router";
import type { CategoryWithBooks } from "../../types/categorySearch";
import { useCategories, useHotBooks, formatHeat } from "./index";
import { useChapterStore } from "../../store/useChapterStore";
import MobileNavbar from "../../components/MobileNavbar";

export default function Mobile() {
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
      <MobileNavbar
        title="夜读小说网"
        subtitle="精品小说 · 夜夜精彩"
        showBack={true}
        showSearch={true}
        onBackClick={() => window.history.back()}
      />

      <div className="px-4 py-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 mb-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <div className="flex-1 mb-4 sm:mb-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
                <Library className="h-5 w-5 mr-2 text-blue-500" />
                精品小说汇聚地
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base mb-4">
                每晚22:00准时更新 · 千万书友共同选择
              </p>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-400 dark:text-gray-400">
                <span className="flex items-center">
                  <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span>总藏书: <span className="text-gray-900 dark:text-white font-bold ml-1">500+</span> 本</span>
                </span>
                <span className="flex items-center">
                  <Library className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span>分类: <span className="text-gray-900 dark:text-white font-bold ml-1">{categoriesWithBooks.length}</span> 个</span>
                </span>
                <span className="flex items-center">
                  <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span>在线: <span className="text-gray-900 dark:text-white font-bold ml-1">24H</span></span>
                </span>
              </div>
            </div>
            <div className="text-right">
              <Link to="/rank">
                <div className="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-600 cursor-pointer transition-colors touch-target flex items-center justify-center">
                  <Flame className="h-4 w-4 mr-1" />
                  立即探索
                </div>
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Button 
              block 
              type="primary"
              className="bg-blue-500 hover:bg-blue-600 border-0 h-12 text-white text-sm touch-target"
              onClick={() => navigate('/search')}
            >
              <div className="flex items-center justify-center">
                <Search className="h-4 w-4 mr-1" />
                搜索小说
              </div>
            </Button>
            <Button 
              block 
              className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white h-12 text-sm touch-target"
              onClick={handleContinueReading}
              disabled={!hasReadingProgress}
            >
              <div className="flex items-center justify-center">
                <BookOpen className="h-4 w-4 mr-1" />
                继续阅读
              </div>
            </Button>
          </div>
        </div>
      <Card className="mb-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="p-4">
            <h4 className="text-gray-900 dark:text-white font-bold text-lg mb-4 flex items-center">
              <Zap className="h-5 w-5 mr-2 text-yellow-500" />
              快捷功能
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <Link to="/category/''" className="block">
                <Button 
                  block 
                  className="bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 border-0 text-white h-14 text-sm touch-target cursor-pointer"
                >
                  <div className="flex flex-col items-center">
                    <Grid className="h-5 w-5 mb-1" />
                    <span>全部分类</span>
                  </div>
                </Button>
              </Link>
              <Button 
                block 
                className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white h-14 text-sm touch-target cursor-pointer"
              >
                <div className="flex flex-col items-center">
                  <BookOpen className="h-5 w-5 mb-1" />
                  <span>我的书架</span>
                </div>
              </Button>
              <Link to="/rank" className="block">
                <Button 
                  block 
                  className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white h-14 text-sm touch-target cursor-pointer"
                >
                  <div className="flex flex-col items-center">
                    <Award className="h-5 w-5 mb-1" />
                    <span>排行榜</span>
                  </div>
                </Button>
              </Link>
            </div>
          </div>
        </Card>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 mb-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900 dark:text-white font-bold text-lg sm:text-xl flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-yellow-500" />
              编辑推荐
            </h3>
            <a href="#" className="text-blue-400 hover:text-blue-300 text-sm font-medium touch-target cursor-pointer">查看更多 →</a>
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
                          className="w-14 h-16 sm:w-16 sm:h-20 object-cover rounded flex-shrink-0"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDIwMCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NiA2NEw5MCA3Nkw5NCA2NEgxMTBMMTMyIDEyOEwxMDggMTQ0SDkwSDEwOEw5NCAxMTZMMTAwIDEwOEw5NiA5Nkg4NlpNMTI0IDExMkwxMjggMTIwUTEyNiAxMzAgMTIyIDEzMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+";
                          }}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-gray-900 dark:text-white font-bold text-sm sm:text-base mb-1 line-clamp-2">
                              {featuredBook?.name || '未知书名'}
                            </h4>
                            <Link to={`/author/${featuredBook?.authorId}`}>
                              <p className="text-gray-400 dark:text-gray-400 text-sm mb-2 flex items-center">
                                <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                {featuredBook?.author || '未知作者'}
                              </p>
                            </Link>
                            <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mb-3 line-clamp-2">
                              {truncateDesc(featuredBook?.desc || '')}
                            </p>
                          </div>
                          <div className="flex-shrink-0 ml-3 flex flex-col items-end">
                            <span className="text-blue-400 text-xs font-medium block mb-2 flex items-center">
                              <Flame className="h-3 w-3 mr-1" />
                              {featuredBook?.status || '状态未知'}
                            </span>
                            <Link to={`/book/${featuredBook?.id}`}>
                              <Button size="small" className="bg-blue-500 hover:bg-blue-600 border-0 text-xs px-2 py-1 touch-target cursor-pointer">
                                立即阅读
                              </Button>
                            </Link>
                          </div>
                        </div>
                        {featuredBook?.lastChapter && (
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
                </Card>
              );
            })}
          </div>
        </div>

        {hotBooks && hotBooks.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-4 flex items-center">
              <Crown className="h-5 w-5 mr-2 text-yellow-500" />
              <Flame className="h-5 w-5 mr-1 text-red-500" />
              畅销榜
            </h3>
            <div className="space-y-3">
              {hotBooks.map((book, index) => {
                const rank = index + 1;
                return (
                  <Link key={book.id} to={`/book/${book.id}`}>
                    <div className="flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded cursor-pointer transition-colors touch-target">
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
        )}

  

        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-4 mb-6 shadow-lg">
          <div className="text-center">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-2 flex items-center justify-center">
              <Target className="h-5 w-5 mr-2" />
              精品分类推荐
            </h2>
            <p className="text-blue-100 text-sm sm:text-base">
              精心挑选各类优质小说，满足您的阅读需求
            </p>
            <div className="mt-3 flex flex-wrap justify-center items-center gap-2 sm:gap-4 text-xs sm:text-sm text-blue-100">
              <span className="flex items-center">
                <Award className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                品质保证
              </span>
              <span className="flex items-center">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                热门推荐
              </span>
              <span className="flex items-center">
                <Heart className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                精品内容
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {categories && categories.map((category: CategoryWithBooks) => {
            const hasBooks = category?.books && category.books.length > 0;
            
            return (
              <div key={category?.id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <div className="bg-gray-100 dark:bg-gray-700 p-3 sm:p-4 border-l-4 border-blue-500">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Link to={`/category/${category?.id}`}>
                        <h3 className="text-gray-900 dark:text-white font-bold text-base sm:text-lg mb-1 cursor-pointer hover:text-blue-500 transition-colors flex items-center">
                          <Library className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-500" />
                          {category?.name || '未知分类'}
                        </h3>
                      </Link>
                      <p className="text-gray-400 dark:text-gray-400 text-xs sm:text-sm">
                        {hasBooks ? (
                          <span className="flex items-center flex-wrap gap-1">
                            <Gem className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500" />
                            {category.books.length}本精品 · 
                            <Flame className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                            火热更新 · 
                            <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
                            品质保证
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <Target className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
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

                <div className="p-3 sm:p-4">
                  {hasBooks ? (
                    <div className="space-y-3">
                      {category.books.map((book, index) => (
                        <Card key={book?.id} className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 hover:shadow-lg touch-target">
                          <Card.Body className="p-3 sm:p-4">
                            <div className="flex space-x-3">
                              <div className="relative flex-shrink-0">
                                {book?.bookImage && (
                                  <img 
                                    src={book.bookImage} 
                                    alt={book?.name || '书籍封面'}
                                    className="w-14 h-16 sm:w-16 sm:h-20 object-cover rounded"
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
                                  <span className={`${book?.status?.includes('连载') ? 'bg-green-500' : 'bg-blue-500'} text-white px-2 py-1 rounded text-xs font-bold`}>
                                    {book?.status || '状态未知'}
                                  </span>
                                </div>
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-gray-900 dark:text-white font-bold text-sm sm:text-base mb-2 line-clamp-2 leading-tight">
                                      {book?.name || '未知书名'}
                                    </h4>
                                    
                                    <div className="flex items-center text-xs sm:text-sm text-gray-400 dark:text-gray-400 mb-3">
                                      <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                      <Link to={`/author/${book?.authorId}`} className="truncate hover:text-blue-400 cursor-pointer">
                                        {book?.author || '未知作者'}
                                      </Link>
                                    </div>

                                    <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mb-3 line-clamp-2">
                                      {truncateDesc(book?.desc || '')}
                                    </p>

                                    {book?.lastChapter && (
                                      <div className="mb-3 p-2 bg-gray-100 dark:bg-gray-600 rounded text-xs sm:text-sm">
                                        <div className="text-gray-600 dark:text-gray-300 flex items-center">
                                          <BookOpen className="h-3 w-3 mr-1" />
                                          最新: {book.lastChapter}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  
                                  <div className="flex-shrink-0 ml-3 flex flex-col items-end space-y-2">
                                    <div className="flex items-center space-x-1">
                                      <Flame className="h-4 w-4 text-red-500" />
                                      <span className="text-xs sm:text-sm text-gray-400 dark:text-gray-400">热门</span>
                                    </div>
                                    <Link to={`/book/${book?.id}`}>
                                      <Button 
                                        size="small"
                                        className="bg-blue-500 hover:bg-blue-600 border-0 text-xs sm:text-sm px-2 sm:px-3 py-1 font-bold touch-target cursor-pointer"
                                      >
                                        <div className="flex items-center justify-center">
                                          <BookOpen className="h-4 w-4 mr-1" />
                                          阅读
                                        </div>
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
                    <div className="text-center py-8 sm:py-12">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 dark:text-gray-400" />
                      </div>
                      <h4 className="text-gray-400 dark:text-gray-400 font-medium mb-2">精彩即将呈现</h4>
                      <p className="text-gray-500 dark:text-gray-500 text-xs sm:text-sm">
                        我们正在精心策划优质的{category?.name}小说内容，敬请期待！
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {isLoading && (
          <Card className="mt-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <div className="p-6 sm:p-8 text-center">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-2 border-blue-500 border-t-transparent rounded-full mr-3"></div>
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
            <div className="p-6 sm:p-8 text-center">
              <div className="text-blue-400 mb-4">
                <div className="flex justify-center mb-2">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-red-500 mx-auto" />
                  </div>
                </div>
                <div className="font-medium text-gray-900 dark:text-white">加载失败</div>
                <div className="text-sm text-gray-400 dark:text-gray-400">
                  {error instanceof Error ? error.message : "未知错误"}
                </div>
              </div>
              <Button 
                type="primary"
                size="small"
                className="bg-blue-500 hover:bg-blue-600 border-0 touch-target cursor-pointer"
                onClick={() => window.location.reload()}
              >
                <div className="flex items-center justify-center">
                  <RefreshCw className="h-4 w-4 mr-1" />
                  重新加载
                </div>
              </Button>
            </div>
          </Card>
        )}
      </div>

      <footer className="bg-gray-800 dark:bg-gray-800 border-t border-gray-700 dark:border-gray-700 py-6 sm:py-8 mt-8 transition-colors duration-300">
        <div className="px-4 text-center">
          <h4 className="font-bold text-white mb-3 text-base sm:text-lg flex items-center justify-center">
            <Library className="h-5 w-5 mr-2 text-blue-500" />
            夜读小说网
          </h4>
          <p className="text-sm text-gray-400 dark:text-gray-400 mb-4">发现更多精彩故事 · 享受沉浸式阅读时光</p>
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-500 dark:text-gray-500 mb-4">
            <span className="flex items-center">
              <Award className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-blue-500" />
              品质
            </span>
            <span className="flex items-center">
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-green-500" />
              更新
            </span>
            <span className="flex items-center">
              <Heart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-purple-500" />
              推荐
            </span>
            <span className="flex items-center">
              <Star className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-yellow-500" />
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
