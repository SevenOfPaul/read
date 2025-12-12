import { Button, Card, Pagination, ActionSheet } from "react-vant";
import { BookOpen, User, Settings, Palette, Type } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useChapterContent, useChapters, handleChapterJump } from "./index";
import type { ChapterRead, ChapterInfo } from "../../types/ChapterRead";
import MobileNavbar from "../../components/MobileNavbar";
import { useMemo, useEffect, useState } from "react";
import { useChapterStore } from "../../lib/useChapterStore";
import { useReadThemeStore, getBgThemeClasses, getFontSizeClasses, getLineHeightClasses } from "../../lib/useReadThemeStore";

export default function Mobile() {
  const navigate = useNavigate();
  const { currentChapterId } = useChapterStore();
  const { bg, font, setBgTheme, setFont, resetToDefault } = useReadThemeStore();
  const { data: chapter, isLoading: chapterLoading, error: chapterError } = useChapterContent();
  const { data: chapters, isLoading: chaptersLoading, error: chaptersError } = useChapters();
  const [showThemeSheet, setShowThemeSheet] = useState(false);
  const [showBgSheet, setShowBgSheet] = useState(false);
  const [showFontSheet, setShowFontSheet] = useState(false);

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

  const handleBgThemeChange = (newBg: string) => {
    setBgTheme(newBg);
    setShowBgSheet(false);
  };

  const handleFontChange = (newFont: string) => {
    setFont(newFont);
    setShowFontSheet(false);
  };

  const bgThemeOptions = [
    { value: 'default', label: '默认' },
    { value: 'sepia', label: '护眼' },
    { value: 'dark', label: '深色' },
    { value: 'green', label: '绿色' },
    { value: 'blue', label: '蓝色' },
  ];

  const fontSizeOptions = [
    { value: 'small', label: '小号字体' },
    { value: 'medium', label: '中号字体' },
    { value: 'large', label: '大号字体' },
    { value: 'xlarge', label: '超大字体' },
  ];

  return (
    <div className={`chapter-read-container min-h-screen ${getBgThemeClasses(bg, document.documentElement.classList.contains('dark'))}`}>
      {/* 统一的移动端导航栏 */}
      <MobileNavbar
        title={chapter.book.name}
        showBack={true}
        showSearch={true}
        onBackClick={() => navigate(`/book/${chapter.bookId}`)}
        customActions={
          <button 
            onClick={() => setShowThemeSheet(true)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 touch-target"
          >
            <Settings className="h-5 w-5" />
          </button>
        }
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
            <div 
              className={`prose prose-sm max-w-none dark:prose-invert ${getFontSizeClasses(font)} ${getLineHeightClasses(font)}`} 
              dangerouslySetInnerHTML={{__html:formatContent(chapter.content)}}
            >
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

      {/* 主题设置 ActionSheet */}
      <ActionSheet
        show={showThemeSheet}
        onCancel={() => setShowThemeSheet(false)}
        cancelText="取消"
        title="阅读设置"
      >
        <div className="p-4 space-y-4">
          {/* 背景主题选择 */}
          <div>
            <div className="flex items-center mb-3">
              <Palette className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
              <span className="text-base font-medium text-gray-800 dark:text-gray-200">背景主题</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {bgThemeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleBgThemeChange(option.value)}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200 touch-target ${
                    bg === option.value 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                      : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* 字体大小选择 */}
          <div>
            <div className="flex items-center mb-3">
              <Type className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
              <span className="text-base font-medium text-gray-800 dark:text-gray-200">字体大小</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {fontSizeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFontChange(option.value)}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200 touch-target ${
                    font === option.value 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                      : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* 重置按钮 */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
            <button
              onClick={() => {
                resetToDefault();
                setShowThemeSheet(false);
              }}
              className="w-full py-3 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200 touch-target"
            >
              重置为默认设置
            </button>
          </div>
        </div>
      </ActionSheet>
    </div>
  );
}
