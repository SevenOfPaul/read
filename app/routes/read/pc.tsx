import { Button, Card, Pagination } from "react-vant";
import { BookOpen, User } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useChapterContent, useChapters, handleChapterJump } from "./index";
import type { ChapterRead, ChapterInfo } from "../../types/ChapterRead";
import Navbar from "@/components/Navbar";
import { useMemo, useEffect } from "react";
import { useChapterStore } from "../../lib/useChapterStore";

export default function PC() {
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
  const { currentPage, totalPages, navigation } = useMemo(() => {
    if (!chapters || !chapter) {
      return { currentPage: 1, totalPages: 1, navigation: null };
    }

    const currentIndex = chapters.findIndex(c => c.id === chapter.id);
    const total = chapters.length;
    const pageSize = 1; // 每个章节一页
    const totalPages = Math.ceil(total / pageSize);
    const currentPage = currentIndex + 1;

    const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : undefined;
    const nextChapter = currentIndex < total - 1 ? chapters[currentIndex + 1] : undefined;

    return {
      currentPage,
      totalPages,
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
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <span className="ml-4 text-gray-600 dark:text-gray-300">正在加载章节内容...</span>
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
        <div className="flex items-center justify-center min-h-screen">
          <Card className="p-8 text-center max-w-md">
            <div className="text-6xl mb-4">😵</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">加载失败</h3>
            <p className="text-gray-400 dark:text-gray-400 mb-6">
              {errorMessage}
            </p>
            <Button onClick={() => window.location.reload()} className="bg-blue-500 hover:bg-blue-600 border-0">
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
        <div className="flex items-center justify-center min-h-screen">
          <Card className="p-8 text-center max-w-md">
            <div className="text-6xl mb-4">📖</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">章节不存在</h3>
            <Link to="/">
              <Button className="bg-blue-500 hover:bg-blue-600 border-0">
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
    <div className="chapter-read-container">
      {/* 顶部导航 */}
      <Navbar />

      {/* 主内容区域 */}
      <div className="max-w-4xl mx-auto px-3 py-6 dark:bg-gray-600 min-h-screen">
        {/* 美化后的书籍和章节信息 */}
        <Card className="chapter-header mb-6">
          {/* 书籍信息区域 */}
          <div className="chapter-book-info">
            <Link to={`/book/${chapter.book.id}`} className="chapter-book-link">
              <BookOpen className="h-5 w-5" />
              <span className="font-medium">{chapter.book.name}</span>
            </Link>
            
            <span className="chapter-info-divider">•</span>
              <Link to={`/author/${chapter.book.authorId}`} className="chapter-User-link">
            <div className="chapter-author-info">
            
                <User className="h-4 w-4" />
                <span>{chapter.book.authorName}</span>
           
            </div>
               </Link>
          </div>

          {/* 章节标题区域 */}
          <div className="chapter-title-container">
            <h1 className="chapter-title">
              {chapter.name}
            </h1>
          </div>

          {/* 进度信息区域 */}
          <div className="chapter-progress-container">
            {/* 进度信息 */}
            <div className="chapter-progress-info">
              <div className="flex items-center space-x-2">
                <span className="font-medium">
                  第 {navigation ? navigation.currentIndex + 1 : 0} 章 / 共 {navigation ? navigation.totalChapters : 0} 章
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* 章节内容 */}
        <Card className="chapter-content mb-6">
          <div className="chapter-text">
            <div className="chapter-content-text prose prose-lg max-w-none dark:prose-invert" 
            dangerouslySetInnerHTML={{__html:formatContent(chapter.content)}}>
            </div>
          </div>
        </Card>

        {/* 章节导航 */}
        <Card className="chapter-navigation py-2">
          {/* Vant分页组件 - 自定义上下页文本 */}
          <div className="text-center mb-6">
            <Pagination
              value={currentPage}
              totalItems={navigation?.totalChapters || 0}
              itemsPerPage={1}
              showPageSize={5}
              forceEllipses
              onChange={handlePageChange}
              prevText="上一章"
              nextText="下一章"
              className="pagination-custom"
            />
          </div>

          {/* 快速返回按钮 */}
          <div className="flex justify-center space-x-4 ">
            <Link to={`/book/${chapter.bookId}`}>
              <Button className="bg-gray-100 w-43 rounded-xl!  dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white transition-colors duration-300">
                📚 返回目录
              </Button>
            </Link>
            <Link to="/">
              <Button className="bg-gray-100 w-43 rounded-xl! dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white transition-colors duration-300">
                🏠 返回首页
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
