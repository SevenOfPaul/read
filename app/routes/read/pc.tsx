import { Button, Card } from "react-vant";
import { ArrowLeft, ArrowRight, BookOpen, User } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useChapterContent, useChapters, handleChapterJump } from "./index";
import type { ChapterRead, ChapterInfo } from "../../types/ChapterRead";
import Navbar from "@/components/Navbar";
import { Pagination } from "react-vant";
import { useMemo } from "react";

export default function PC() {
  const navigate = useNavigate();
  const { data: chapter, isLoading: chapterLoading, error: chapterError } = useChapterContent();
  const { data: chapters, isLoading: chaptersLoading, error: chaptersError } = useChapters();

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
    return (
      <div className="chapter-read-container">
        <div className="flex items-center justify-center min-h-screen">
          <Card className="p-8 text-center max-w-md">
            <div className="text-6xl mb-4">😵</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">加载失败</h3>
            <p className="text-gray-400 dark:text-gray-400 mb-6">
              {(chapterError || chaptersError) instanceof Error 
                ? (chapterError || chaptersError).message 
                : "无法获取章节内容"}
            </p>
            <Button onClick={() => window.location.reload()} className="bg-blue-500 hover:bg-blue-600">
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
              <Button className="bg-blue-500 hover:bg-blue-600">
                🏠 返回首页
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  // 处理章节导航
  const handlePrevChapter = () => {
    if (navigation?.prevChapter) {
      handleChapterJump(navigate, chapter.bookId, navigation.prevChapter.id);
    }
  };

  const handleNextChapter = () => {
    if (navigation?.nextChapter) {
      handleChapterJump(navigate, chapter.bookId, navigation.nextChapter.id);
    }
  };

  const handlePageChange = (page: number) => {
    if (chapters && page >= 1 && page <= chapters.length) {
      const targetChapter = chapters[page - 1];
      if (targetChapter) {
        handleChapterJump(navigate, chapter.bookId, targetChapter.id);
      }
    }
  };

  // 格式化章节内容，添加段落换行
  const formatContent = (content: string) => {
    if (!content) return "暂无内容";
    
    // 将换行符转换为段落
    return content.split('\n').map((paragraph, index) => (
      <p key={index} className="chapter-paragraph mb-4 leading-relaxed text-gray-800 dark:text-gray-200">
        {paragraph.trim()}
      </p>
    )).filter(paragraph => paragraph.props.children.length > 0);
  };

  return (
    <div className="chapter-read-container">
      {/* 顶部导航 */}
      <Navbar />

      {/* 主内容区域 */}
      <div className="max-w-4xl mx-auto px-6 py-8 dark:bg-gray-600 min-h-screen">
        {/* 书籍和章节信息 */}
        <Card className="chapter-header mb-6">
          <div className="text-center">
            <div className="mb-4">
              <Link to={`/book/${chapter.book.id}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                📚 {chapter.book.name}
              </Link>
              <span className="text-gray-400 mx-2">|</span>
              <span className="text-gray-600 dark:text-gray-300">作者：{chapter.book.authorName}</span>
            </div>
            <h1 className="chapter-title text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {chapter.name}
            </h1>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              第 {navigation?.currentIndex || 0} 章 / 共 {navigation?.totalChapters || 0} 章
            </div>
          </div>
        </Card>

        {/* 章节内容 */}
        <Card className="chapter-content mb-6">
          <div className="chapter-text">
            <div className="chapter-content-text prose prose-lg max-w-none dark:prose-invert">
              {formatContent(chapter.content)}
            </div>
          </div>
        </Card>

        {/* 章节导航 */}
        <Card className="chapter-navigation">
          <div className="flex items-center justify-between mb-6">
            {/* 上一章按钮 */}
            <div className="flex-1">
              {navigation?.prevChapter ? (
                <Button 
                  className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-white"
                  onClick={handlePrevChapter}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  上一章：{navigation.prevChapter.name}
                </Button>
              ) : (
                <div className="w-full h-10 flex items-center justify-center text-gray-400 dark:text-gray-500">
                  已经是第一章
                </div>
              )}
            </div>

            {/* 中间间距 */}
            <div className="w-8"></div>

            {/* 下一章按钮 */}
            <div className="flex-1">
              {navigation?.nextChapter ? (
                <Button 
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={handleNextChapter}
                >
                  下一章：{navigation.nextChapter.name}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <div className="w-full h-10 flex items-center justify-center text-gray-400 dark:text-gray-500">
                  已经是最后一章
                </div>
              )}
            </div>
          </div>

          {/* Vant分页组件 */}
          <div className="text-center">
            <Pagination
              v-model={currentPage}
              totalItems={navigation?.totalChapters || 0}
              itemsPerPage={1}
              showPageSize={5}
              forceEllipses
              onChange={handlePageChange}
              className="pagination-custom"
            />
          </div>

          {/* 快速返回按钮 */}
          <div className="flex justify-center mt-4 space-x-4">
            <Link to={`/book/${chapter.bookId}`}>
              <Button className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-700 dark:text-white">
                📚 返回书籍详情
              </Button>
            </Link>
            <Link to="/">
              <Button className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-700 dark:text-white">
                🏠 返回首页
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
