import { Button, Card, Pagination } from "react-vant";
import { BookOpen, User } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useChapterContent, useChapters, handleChapterJump } from "./index";
import type { ChapterRead, ChapterInfo } from "../../types/ChapterRead";
import MobileNavbar from "../../components/MobileNavbar";
import { useMemo, useEffect } from "react";
import { useChapterStore } from "../../lib/useChapterStore";

export default function Mobile() {
  const navigate = useNavigate();
  const { currentChapterId } = useChapterStore();
  const { data: chapter, isLoading: chapterLoading, error: chapterError } = useChapterContent();
  const { data: chapters, isLoading: chaptersLoading, error: chaptersError } = useChapters();

  // 章节变化时更新 store 状态
  useEffect(() => {
    if (chapter?.id && chapter?.bookId) {
      useChapterStore.getState().setCurrentChapter(chapter.id, chapter.bookId);
    }
  }, [chapter]);

  // 计算当前章节在章节列表中的位置
  const { currentPage, navigation } = useMemo(() => {
    if (!chapters || !chapter) {
      return { currentPage: 1, navigation: null };
    }

    const currentIndex = chapters.findIndex(c => c.id === chapter.id);
    const total = chapters.length;
    const currentPage = currentIndex + 1;

    const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : undefined;
    const nextChapter = currentIndex < total - 1 ? chapters[currentIndex + 1] : undefined;

    return {
      currentPage,
      navigation: {
        prevChapter,
        nextChapter,
        currentIndex,
        totalChapters: total
      }
    };
  }, [chapters, chapter]);

  // 加载状态
  if (chapterLoading || chaptersLoading) {
    return (
      <div className="chapter-read-container">
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
            <span className="text-gray-600 dark:text-gray-300">正在加载章节内容...</span>
          </div>
        </div>
      </div>
    );
  }

  // 错误状态
  if (chapterError || chaptersError) {
    const errorMessage = chapterError instanceof Error 
      ? chapterError.message 
      : chaptersError instanceof Error 
        ? chaptersError.message 
        : "无法获取章节内容";
    
    return (
      <div className="chapter-read-container">
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
          <Card className="p-6 text-center max-w-sm mx-4">
            <div className="text-5xl mb-4">😵</div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">加载失败</h3>
            <p className="text-sm text-gray-400 dark:text-gray-400 mb-4">
              {errorMessage}
            </p>
            <Button 
              onClick={() => window.location.reload()} 
              size="small" 
              className="bg-blue-500 hover:bg-blue-600 border-0 touch-target"
            >
              🔄 重新加载
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="chapter-read-container">
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
          <Card className="p-6 text-center max-w-sm mx-4">
            <div className="text-5xl mb-4">📖</div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">章节不存在</h3>
            <Link to="/">
              <Button 
                size="small" 
                className="bg-blue-500 hover:bg-blue-600 border-0 touch-target"
              >
                🏠 返回首页
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  const handlePageChange = (page: number) => {
    if (chapters && page >= 1 && page <= chapters.length) {
      const targetChapter = chapters[page - 1];
      if (targetChapter) {
        handleChapterJump(navigate, chapter.bookId, targetChapter.id);
        // store 状态会在 useEffect 中自动更新
      }
    }
  };

  // 格式化章节内容，添加段落换行
  const formatContent = (content: string) => {
    if (!content) return "暂无内容";
    
    // 将换行符转换为段落
    return content;
  };

  return (
    <div className="chapter-read-container min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 统一的移动端导航栏 */}
      <MobileNavbar
        title={chapter.book.name}
        showBack={true}
        showSearch={true}
        onBackClick={() => navigate(`/book/${chapter.bookId}`)}
      />

      {/* 移动端主内容 */}
      <div className="px-4 py-4">
        {/* 移动端书籍和章节信息 */}
        <Card className="mb-4">
          <div className="space-y-3">
            {/* 书籍信息 */}
            <div className="flex items-center space-x-2 text-sm">
              <Link 
                to={`/book/${chapter.book.id}`} 
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 touch-target"
              >
                <BookOpen className="h-4 w-4" />
                <span className="font-medium">{chapter.book.name}</span>
              </Link>
              <span className="text-gray-400">•</span>
              <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                <User className="h-3 w-3" />
                <span className="text-xs">{chapter.book.authorName}</span>
              </div>
            </div>

            {/* 章节标题 */}
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              {chapter.name}
            </h1>

            {/* 进度信息 */}
            <div className="text-xs text-gray-500 dark:text-gray-400">
              第 {navigation ? navigation.currentIndex + 1 : 0} 章 / 共 {navigation ? navigation.totalChapters : 0} 章
            </div>
          </div>
        </Card>

        {/* 移动端章节内容 */}
        <Card className="mb-4">
          <div className="chapter-content-text">
            <div className="prose prose-sm max-w-none dark:prose-invert" 
            dangerouslySetInnerHTML={{__html:formatContent(chapter.content)}}>
            </div>
          </div>
        </Card>

        {/* 移动端章节导航 */}
        <Card className="py-4">
          {/* Vant分页组件 - 移动端优化 */}
          <div className="mb-4">
            <Pagination
              value={currentPage}
              totalItems={navigation?.totalChapters || 0}
              itemsPerPage={1}
              showPageSize={3}
              forceEllipses
              onChange={handlePageChange}
              prevText="上一章"
              nextText="下一章"
              className="pagination-custom"
            />
          </div>

          {/* 移动端快速返回按钮 */}
          <div className="flex space-x-3">
            <Link to={`/book/${chapter.bookId}`} className="flex-1">
              <Button 
                className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white touch-target" 
                size="small"
              >
                📚 返回目录
              </Button>
            </Link>
            <Link to="/" className="flex-1">
              <Button 
                className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white touch-target" 
                size="small"
              >
                🏠 返回首页
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
