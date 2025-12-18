import { Button, Card } from "react-vant";
import { BookOpen, User, Clock, Heart, Share, Star, Eye, Award, MoreVertical } from "lucide-react";
import { Link } from "react-router";
import { useBookDetail, useChapters, useRelatedBooks, handleBookmark, handleShare } from "./index";
import type { BookDetail as BookDetailType, ChapterInfo, RelatedBook } from "../../types/BookDetail";
import MobileNavbar from "../../components/MobileNavbar";
const imgHost = import.meta.env.VITE_imgHost;
import "./index.css"

export default function Mobile() {
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
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-300">正在加载书籍信息...</span>
        </div>
      </div>
    );
  }

  // 错误状态
  if (bookError) {
    return (
      <div className="book-detail-container">
        <div className="flex items-center justify-center min-h-screen p-4">
          <Card className="p-6 text-center max-w-sm w-full">
            <div className="text-4xl mb-4">😵</div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">加载失败</h3>
            <p className="text-gray-400 dark:text-gray-400 mb-6 text-sm">
              {bookError instanceof Error ? bookError.message : "无法获取书籍信息"}
            </p>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-blue-500 hover:bg-blue-600 w-full touch-target"
            >
              🔄 重新加载
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="book-detail-container">
        <div className="flex items-center justify-center min-h-screen p-4">
          <Card className="p-6 text-center max-w-sm w-full">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">书籍不存在</h3>
            <p className="text-gray-400 dark:text-gray-400 mb-6 text-sm">
              请检查链接是否正确
            </p>
            <Link to="/">
              <Button className="bg-blue-500 hover:bg-blue-600 w-full touch-target">
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
      {/* 统一的移动端导航栏 */}
      <MobileNavbar
        title={book.name}
        showBack={true}
        showSearch={true}
        onBackClick={() => window.history.back()}
      />

      <div className="px-4 py-4 space-y-4">
        {/* 书籍信息卡片 */}
        <Card className="book-info">
          <div className="flex space-x-3 sm:space-x-4">
            {/* 书籍封面 */}
            <div className="flex-shrink-0">
              {book.bookImage ? (
                <img 
                  src={book.bookImage} 
                  alt={book.name}
                  className="w-20 h-24 sm:w-24 sm:h-28 lg:w-28 lg:h-32 object-cover rounded"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDIwMCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NiA2NEw5MCA3Nkw5NCA2NEgxMTBMMTMyIDEyOEwxMDggMTQ0SDkwSDEwOEw5NCAxMTZMMTAwIDEwOEw5NiA5Nkg4NlpNMTI0IDExMkwxMjggMTIwUTEyNiAxMzAgMTIyIDEzMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+";
                  }}
                />
              ) : (
                <div className="w-20 h-24 sm:w-24 sm:h-28 lg:w-28 lg:h-32 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded">
                  <BookOpen className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>

            {/* 书籍详细信息 */}
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-2 leading-tight line-clamp-2">
                {book.name}
              </h1>
              
              <div className="space-y-2 mb-3">
                <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm">
                  <User className="h-4 w-4 mr-2" />
                  <span>{book.authorName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs">
                    {book.categoryName}
                  </span>
                  <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded text-xs">
                    {book.status}
                  </span>
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
                {book.desc}
              </p>
            </div>
          </div>

          {/* 移动端操作按钮 */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 gap-3">
              <Link 
                className="block"
                to={`/read/${book.id}/${chapters && chapters.length ? chapters[0].id : ''}`}
              >
                <Button 
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold w-full h-12 touch-target"
                  disabled={!chapters || chapters.length === 0}
                >
                  📖 开始阅读
                </Button>
              </Link>
              <Button 
                className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-700 dark:text-white w-full h-12 touch-target"
                onClick={() => handleBookmark(book.id)}
              >
                <Heart className="h-4 w-4 mr-2" />
                收藏
              </Button>
            </div>
          </div>
        </Card>

        {/* 书籍统计信息 */}
        <Card className="p-4">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-lg">📊 书籍信息</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-lg font-bold text-blue-500">{chapters?.length || 0}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">章节数</div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-lg font-bold text-orange-500">{book.fired}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">热度值</div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-lg font-bold text-green-500">{book.status}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">状态</div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-lg font-bold text-purple-500">{book.categoryName}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">分类</div>
            </div>
          </div>
          {book.lastChapter && (
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium">📖 最新章节：</span>
                <span className="ml-1">{book.lastChapter}</span>
              </div>
            </div>
          )}
          {book.updateTime && (
            <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                <Clock className="h-3 w-3 inline mr-1" />
                更新时间：{new Date(book.updateTime).toLocaleDateString()}
              </div>
            </div>
          )}
        </Card>

        {/* 快捷操作 */}
        <Card className="p-4">
          <h4 className="font-bold text-gray-900 dark:text-white mb-4 text-lg">⚡ 快捷操作</h4>
          <div className="grid grid-cols-2 gap-3">
            <Link 
              className="block"
              to={`/read/${book.id}/${chapters && chapters.length ? chapters[0].id : ''}`}
            >
              <Button 
                block 
                className="bg-blue-500 hover:bg-blue-600 text-white h-10 touch-target"
                disabled={!chapters || chapters.length === 0}
              >
                📖 立即阅读
              </Button>
            </Link>
            <Button 
              block 
              className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-white h-10 touch-target"
              onClick={() => handleBookmark(book.id)}
            >
              🔖 收藏本书
            </Button>
          </div>
        </Card>

        {/* 章节目录 */}
        <Card className="chapters-container">
          <div className="chapters-header mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              📚 全部章节 
              <span className="text-sm text-gray-500 ml-2">({chapters?.length || 0}章)</span>
            </h2>
          </div>

          {chaptersLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
              <span className="ml-2 text-gray-600 text-sm">正在加载章节列表...</span>
            </div>
          ) : chaptersError ? (
            <div className="text-center py-8 text-red-500 text-sm">
              <p>章节加载失败: {chaptersError instanceof Error ? chaptersError.message : "未知错误"}</p>
            </div>
          ) : chapters && chapters.length > 0 ? (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {chapters.map((chapter: ChapterInfo) => (
                <Link 
                  key={chapter.id} 
                  to={`/read/${book.id}/${chapter.id}`}
                  className="chapter-link flex items-center justify-between border-b border-gray-100 dark:border-gray-700 last:border-b-0 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors touch-target"
                >
                  <span className="text-gray-700 dark:text-gray-300 text-sm font-medium truncate mr-4 flex-1">
                    {chapter.name}
                  </span>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <span className="text-gray-400 dark:text-gray-500 text-xs">
                      第{chapter.idx}章
                    </span>
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">暂无章节信息</p>
            </div>
          )}
        </Card>

        {/* 相关推荐 */}
        {relatedBooks && relatedBooks.length > 0 && (
          <Card className="related-books">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">📖 相关推荐</h3>
            <div className="space-y-3">
              {relatedBooks.map((relatedBook: RelatedBook) => (
                <Link 
                  key={relatedBook.id} 
                  to={`/book/${relatedBook.id}`}
                  className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors touch-target"
                >
                  <img 
                    src={relatedBook.bookImage ? `${import.meta.env.VITE_imgHost}${relatedBook.bookImage}` : "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDIwMCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NiA2NEw5MCA3Nkw5NCA2NEgxMTBMMTMyIDEyOEwxMDggMTQ0SDkwSDEwOEw5NCAxMTZMMTAwIDEwOEw5NiA5Nkg4NlpNMTI0IDExMkwxMjggMTIwUTEyNiAxMzAgMTIyIDEzMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+"} 
                    alt={relatedBook.name}
                    className="w-12 h-16 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                      {relatedBook.name}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">👤 {relatedBook.authorName}</p>
                    {relatedBook.lastChapter && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">📖 {relatedBook.lastChapter}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-center">
                    <Star className="h-4 w-4 text-yellow-500 mb-1" />
                    <span className="text-xs text-gray-400">9.2</span>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* 移动端底部固定操作栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 z-50">
        <div className="grid grid-cols-2 gap-3">
          <Link 
            className="block"
            to={`/read/${book.id}/${chapters && chapters.length ? chapters[0].id : ''}`}
          >
            <Button 
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold w-full h-12 touch-target"
              disabled={!chapters || chapters.length === 0}
            >
              📖 立即阅读
            </Button>
          </Link>
          <Button 
            className="bg-gray-100 dark:bg-gray-700 flex flex-col hover:bg-gray-200 text-gray-700 dark:text-white w-full h-12 touch-target"
            onClick={() => handleBookmark(book.id)}
          >
            <Heart className="h-4 w-4 mr-2" />
            收藏本书
          </Button>
        </div>
      </div>

      {/* 为底部操作栏留出空间 */}
      <div className="h-20"></div>
    </div>
  );
}
