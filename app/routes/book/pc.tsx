import { Button, Card } from "react-vant";
import { BookOpen, User, Clock, Heart, Share, Award } from "lucide-react";
import { Link } from "react-router";
import { useBookDetail, useChapters, useRelatedBooks, handleChapterClick, handleBookmark, handleShare } from "./index";
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

  // 跳转到第一章节
  const handleStartReading = () => {
    if (chapters && chapters.length > 0) {
      handleChapterClick(chapters[0].id, book.id);
    }
  };

  return (
    <div className="book-detail-container">
      {/* 顶部导航 */}
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8 dark:bg-gray-600">
        <div className="flex gap-8">
          {/* 左侧内容区域 */}
          <main className="flex-1 space-y-8">
            {/* 书籍信息卡片 */}
            <Card className="book-info">
              <div className="flex space-x-6">
                {/* 书籍封面 */}
                <div className="flex-shrink-0">
                  {book.bookImage ? (
                    <img 
                      src={`${imgHost}${book.bookImage}`} 
                      alt={book.name}
                      className="book-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDIwMCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NiA2NEw5MCA3Nkw5NCA2NEgxMTBMMTMyIDEyOEwxMDggMTQ0SDkwSDEwOEw5NCAxMTZMMTAwIDEwOEw5NiA5Nkg4NlpNMTI0IDExMkwxMjggMTIwUTEyNiAxMzAgMTIyIDEzMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+";
                      }}
                    />
                  ) : (
                    <div className="book-cover bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <BookOpen className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* 书籍详细信息 */}
                <div className="flex-1 min-w-0 px-2">
                  <h1 className="book-title">{book.name}</h1>
                  
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <User className="h-4 w-4 mr-1" />
                      <span>{book.authorName}</span>
                    </div>
                    <span className="book-category">{book.categoryName}</span>
                    <span className="book-status">{book.status}</span>
                  </div>

                  <p className="book-desc mb-6">{book.desc}</p>

                  {/* 操作按钮 */}
                  <div className="flex items-center space-x-4 w-[95%]">
                    <Button 
                      className="btn-primary "
                      size="large"
                      onClick={handleStartReading}
                      disabled={!chapters || chapters.length === 0}
                    >
                      📖 开始阅读
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* 章节目录 */}
            <Card className="chapters-container">
              <div className="chapters-header">
                <h2 className="chapters-title">
                  📚 全部章节 
                  <span className="chapters-count ml-2">({chapters?.length || 0}章)</span>
                </h2>
                <div className="flex items-center space-x-2">
                  {book.lastChapter && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      📖 最新: {book.lastChapter}
                    </span>
                  )}
                </div>
              </div>

              {chaptersLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
                  <span className="ml-2 text-gray-600">正在加载章节列表...</span>
                </div>
              ) : chaptersError ? (
                <div className="text-center py-8 text-red-500">
                  <p>章节加载失败: {chaptersError instanceof Error ? chaptersError.message : "未知错误"}</p>
                </div>
              ) : chapters && chapters.length > 0 ? (
                <div className="chapters-grid">
                  {chapters.map((chapter: ChapterInfo, index: number) => (
                    <div 
                      key={chapter.id} 
                      className="chapter-grid-item"
                      onClick={() => handleChapterClick(chapter.id, book.id)}
                    >
                      <div className="chapter-grid-name">{chapter.name}</div>
                    </div>
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
          <aside className="w-80 flex-shrink-0 space-y-6">
            {/* 书籍统计 */}
            <Card className="p-4">
              <h4 className="font-bold text-gray-900 dark:text-white mb-4">📊 书籍信息</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">状态</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">{book.status}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">分类</span>
                  <Link to={`/category/${book.categoryId}`}>
                  <span className="text-blue-600 dark:text-blue-400 font-medium">{book.categoryName}</span></Link>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">热度</span>
                  <span className="text-orange-600 dark:text-orange-400 font-medium">{book.fired}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">章节数</span>
                  <span className="text-gray-900 dark:text-white font-medium">{chapters?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">更新时间</span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    {book.updateTime ? new Date(book.updateTime).toLocaleDateString() : '-'}
                  </span>
                </div>
              </div>
            </Card>

            {/* 快捷操作 */}
            <Card className="p-4">
              <h4 className="font-bold text-gray-900 dark:text-white mb-4">⚡ 快捷操作</h4>
              <div className="space-y-2">
                <Button 
                  block 
                  className="bg-blue-500 hover:bg-blue-600 text-white my-1"
                  onClick={handleStartReading}
                  disabled={!chapters || chapters.length === 0}
                >
                  📖 立即阅读
                </Button>
                <Button 
                  block 
                  className="my-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-white"
                  onClick={() => handleBookmark(book.id)}
                >
                  🔖 收藏本书
                </Button>
              </div>
            </Card>

            {/* 相关推荐 - 移动到右侧边栏 */}
            {relatedBooks && relatedBooks.length > 0 && (
              <Card className="related-books">
                <h3 className="related-title">📖 相关推荐</h3>
                <div className="space-y-3">
                  {relatedBooks.map((relatedBook: RelatedBook) => (
                    <Link 
                      key={relatedBook.id} 
                      to={`/book/${relatedBook.id}`}
                      className="related-item group"
                    >
                      <img 
                        src={`${import.meta.env.VITE_imgHost}${relatedBook.bookImage}`} 
                        alt={relatedBook.name}
                        className="related-book-cover"
                        loading="lazy"
                      />
                      <div className="related-book-info">
                        <h4 className="related-book-title">{relatedBook.name}</h4>
                        <div className="related-book-author">
                          <User className="h-3 w-3 mr-1" />
                          {relatedBook.authorName}
                        </div>
                        <div className="related-book-meta">
                          <div className="related-book-status">
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
