import { Button, Card } from "react-vant";
import { BookOpen, User, Clock, Heart, Share, Award } from "lucide-react";
import { Link } from "react-router";
import { useBookDetail, useChapters, useRelatedBooks, handleBookmark, handleShare } from "./index";
import type { BookDetail as BookDetailType, ChapterInfo, RelatedBook } from "@/types/BookDetail";
import Navbar from "@/components/Navbar";
const imgHost = import.meta.env.VITE_imgHost;
import "./index.css"

export default function PC() {
  const { data: book, isLoading: bookLoading, error: bookError } = useBookDetail();
  const { data: chapters, isLoading: chaptersLoading, error: chaptersError } = useChapters();
  const { data: relatedBooks, isLoading: relatedLoading } = useRelatedBooks(
    book?.categoryId || "",
    book?.id || ""
  );

  // 加载状态
  if (bookLoading) {
    return (
      <div className="book-detail-container">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <span className="ml-4 text-gray-600 dark:text-gray-300">正在加载书籍信息...</span>
        </div>
      </div>
    );
  }

  // 错误状态
  if (bookError) {
    return (
      <div className="book-detail-container">
        <div className="flex items-center justify-center min-h-screen">
          <Card className="p-8 text-center max-w-md">
            <div className="text-6xl mb-4">😵</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">加载失败</h3>
            <p className="text-gray-400 dark:text-gray-400 mb-6">
              {bookError instanceof Error ? bookError.message : "无法获取书籍信息"}
            </p>
            <Button onClick={() => window.location.reload()} className="bg-blue-500 hover:bg-blue-600">
              🔄 重新加载
            </Button>
             <Link to="/">
               <Button className="bg-blue-500 hover:bg-blue-600">
              🔄 回到首页
                </Button>
            </Link>
          
          </Card>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="book-detail-container">
        <div className="flex items-center justify-center min-h-screen">
          <Card className="p-8 text-center max-w-md">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">书籍不存在</h3>
            <Link to="/home">
              <Button className="bg-blue-500 hover:bg-blue-600">
                🏠 返回首页
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="book-detail-container">
      {/* 顶部导航 */}
      <Navbar />

      <div className="max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 dark:bg-gray-60">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* 左侧内容区域 */}
          <main className="flex-1 space-y-6 lg:space-y-8">
            {/* 书籍信息卡片 */}
            <Card className="book-info">
              <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-4 sm:space-y-0">
                {/* 书籍封面 */}
                <div className="flex-shrink-0 self-center sm:self-start">
                  {book.bookImage ? (
                    <img 
                      src={`${imgHost}${book.bookImage}`} 
                      alt={book.name}
                      className="book-cover w-32 h-40 sm:w-36 sm:h-48 lg:w-40 lg:h-52 object-cover rounded-lg shadow-md border-2 border-gray-100 dark:border-gray-600"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDIwMCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NiA2NEw5MCA3Nkw5NCA2NEgxMTBMMTMyIDEyOEwxMDggMTQ0SDkwSDEwOEw5NCAxMTZMMTAwIDEwOEw5NiA5Nkg4NlpNMTI0IDExMkwxMjggMTIwUTEyNiAxMzAgMTIyIDEzMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+";
                      }}
                    />
                  ) : (
                    <div className="book-cover w-32 h-40 sm:w-36 sm:h-48 lg:w-40 lg:h-52 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-lg">
                      <BookOpen className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* 书籍详细信息 */}
                <div className="flex-1 min-w-0 px-2">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">{book.name}</h1>
                  
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-3">
                     <Link to={`/author/${book.authorId}`}>
                    <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                      <User className="h-4 w-4 mr-1" />
                      <span>{book.authorName}</span>
                    </div>
                    </Link>
                      <Link to={`/category/${book.categoryId}`}>
                    <span className="bg-blue-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                      {book.categoryName}
                    </span>
                       </Link>
                    <span className="bg-green-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                      {book.status}
                    </span>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base mb-6 line-clamp-3">{book.desc}</p>

                  {/* 操作按钮 */}
                  <div className="w-full">
                    <Link className="block w-full" to={`/read/${book.id}/${chapters && chapters.length ? chapters[0].id : ''}`}>
                    <Button 
                      className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 w-full sm:w-auto"
                      size="large"
                      disabled={!chapters || chapters.length === 0}
                    >
                      📖 开始阅读
                    </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>

            {/* 章节目录 */}
            <Card className="chapters-container">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-2 sm:space-y-0">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center">
                  📚 全部章节 
                  <span className="text-blue-600 dark:text-blue-400 text-sm sm:text-base font-medium bg-blue-50 dark:bg-blue-900/30 px-2 sm:px-3 py-1 rounded-full ml-2">
                    ({chapters?.length || 0}章)
                  </span>
                </h2>
                <div className="flex items-center space-x-2">
                  {book.lastChapter && (
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      📖 最新: {book.lastChapter}
                    </span>
                  )}
                </div>
              </div>

              {chaptersLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
                  <span className="ml-2 text-gray-600 text-sm">正在加载章节列表...</span>
                </div>
              ) : chaptersError ? (
                <div className="text-center py-8 text-red-500 text-sm">
                  <p>章节加载失败: {chaptersError instanceof Error ? chaptersError.message : "未知错误"}</p>
                </div>
              ) : chapters && chapters.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {chapters.map((chapter: ChapterInfo, index: number) => (
                    <Link 
                      key={chapter.id} 
                      to={`/read/${book.id}/${chapter.id}`}
                      className="block bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3 text-center hover:bg-blue-500 hover:text-white hover:transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer"
                    >
                      <div className="text-sm font-medium mb-1 whitespace-nowrap overflow-hidden text-ellipsis leading-tight">{chapter.name}</div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>暂无章节信息</p>
                </div>
              )}
            </Card>
          </main>

          {/* 右侧边栏 */}
          <aside className="w-full lg:w-64 xl:w-80 flex-shrink-0 space-y-6">
            {/* 书籍统计 */}
            <Card className="p-4">
              <h4 className="font-bold text-gray-900 dark:text-white mb-4 text-lg">📊 书籍信息</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300 text-sm">状态</span>
                  <span className="text-green-600 dark:text-green-400 font-medium text-sm">{book.status}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300 text-sm">分类</span>
                  <Link to={`/category/${book.categoryId}`}>
                  <span className="text-blue-600 dark:text-blue-400 font-medium text-sm">{book.categoryName}</span></Link>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300 text-sm">热度</span>
                  <span className="text-orange-600 dark:text-orange-400 font-medium text-sm">{book.fired}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300 text-sm">章节数</span>
                  <span className="text-gray-900 dark:text-white font-medium text-sm">{chapters?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300 text-sm">更新时间</span>
                  <span className="text-gray-500 dark:text-gray-400 text-xs">
                    {book.updateTime ? new Date(book.updateTime).toLocaleDateString() : '-'}
                  </span>
                </div>
              </div>
            </Card>

            {/* 快捷操作 */}
            <Card className="p-4">
              <h4 className="font-bold text-gray-900 dark:text-white mb-4 text-lg">⚡ 快捷操作</h4>
              <div className="space-y-2">
                <Link 
                  className="block"
                  to={`/read/${book.id}/${chapters && chapters.length ? chapters[0].id : ''}`}
                >
                  <Button 
                    block 
                    className="bg-blue-500! hover:bg-blue-600 text-white my-1"
                    disabled={!chapters || chapters.length === 0}
                  >
                    📖 立即阅读
                  </Button>
                </Link>
                <Button 
                  block 
                  className="my-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-white"
                  onClick={() => handleBookmark(book.id)}
                >
                  🔖 收藏本书
                </Button>
              </div>
            </Card>

            {/* 相关推荐 */}
            {relatedBooks && relatedBooks.length > 0 && (
              <Card className="p-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                  📖 相关推荐
                </h3>
                <div className="space-y-3">
                  {relatedBooks.map((relatedBook: RelatedBook) => (
                    <Link 
                      key={relatedBook.id} 
                      to={`/book/${relatedBook.id}`}
                      className="flex items-center space-x-3 py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 rounded-xl cursor-pointer hover:shadow-lg hover:transform hover:-translate-y-1"
                    >
                      <img 
                        src={`${import.meta.env.VITE_imgHost}${relatedBook.bookImage}`} 
                        alt={relatedBook.name}
                        className="w-12 h-16 lg:w-16 lg:h-20 object-cover rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 flex-shrink-0"
                        loading="lazy"
                      />
                      <div className="flex-1 min-w-0 space-y-1">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 leading-tight hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
                          {relatedBook.name}
                        </h4>
                        <Link className="block" to={`/author/${relatedBook.authorId}`}>
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300">
                            <User className="h-3 w-3 mr-1" />
                            {relatedBook.authorName}
                          </div>
                        </Link>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-xs text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>连载中</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </Card>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
