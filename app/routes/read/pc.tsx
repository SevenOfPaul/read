import { Button, Card, Pagination } from "react-vant";
import { BookOpen, User, Settings, Palette, Type } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useChapterContent, useChapters, handleChapterJump } from "./index";
import type { ChapterRead, ChapterInfo } from "../../types/ChapterRead";
import Navbar from "@/components/Navbar";
import { useMemo, useEffect, useState, useRef } from "react";
import { useChapterStore } from "../../store/useChapterStore";
import { useReadThemeStore, getBgThemeClasses,getFontSizeClasses,getLineHeightClasses } from "../../store/useReadThemeStore";

export default function PC() {
  const navigate = useNavigate();
  const { currentChapterId } = useChapterStore();
  const { bg, font, setBgTheme, setFont, resetToDefault } = useReadThemeStore();
  const { data: chapter, isLoading: chapterLoading, error: chapterError } = useChapterContent();
  const { data: chapters, isLoading: chaptersLoading, error: chaptersError } = useChapters();
  const [showThemePanel, setShowThemePanel] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭主题面板
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setShowThemePanel(false);
      }
    }

    if (showThemePanel) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showThemePanel]);

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

  const handleBgThemeChange = (newBg: string) => {
    setBgTheme(newBg);
  };

  const handleFontChange = (newFont: string) => {
    setFont(newFont);
  };

  const bgThemeOptions = [
    { value: 'default', label: '默认', color: 'bg-white border-gray-300' },
    { value: 'sepia', label: '护眼', color: 'bg-amber-50 border-amber-300' },
    { value: 'dark', label: '深色', color: 'bg-gray-800 border-gray-600' },
    { value: 'green', label: '绿色', color: 'bg-green-50 border-green-300' },
    { value: 'blue', label: '蓝色', color: 'bg-blue-50 border-blue-300' },
  ];

  const fontSizeOptions = [
    { value: 'small', label: '小' },
    { value: 'medium', label: '中' },
    { value: 'large', label: '大' },
    { value: 'xlarge', label: '超大' },
  ];

  return (
    <div className={`chapter-read-container min-h-screen`}>
      {/* 顶部导航 */}
      <Navbar />

      {/* 主内容区域 */}
      <div className="max-w-4xl mx-auto px-3 py-6 min-h-screen">

        {/* 主题设置面板 */}
        {showThemePanel && (
          <div ref={panelRef} className="fixed top-32 right-6 z-20 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl p-4 w-64">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">阅读设置</h3>
            
            {/* 背景主题选择 */}
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <Palette className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">背景主题</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {bgThemeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleBgThemeChange(option.value)}
                    className={`p-2  cursor-pointer rounded border text-xs ${
                      bg === option.value 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                    } ${option.color} transition-colors duration-200`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 字体大小选择 */}
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <Type className="h-4 w-4 mr-2  text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">字体大小</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {fontSizeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleFontChange(option.value)}
                    className={`p-2 rounded border text-xs cursor-pointer ${
                      font === option.value 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                    } transition-colors duration-200`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 重置按钮 */}
            <button
              onClick={() => resetToDefault()}
              className="w-full py-2 px-4 cursor-pointer bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-sm font-medium transition-colors duration-200"
            >
              重置默认
            </button>
          </div>
        )}

        {/* 美化后的书籍和章节信息 */}
        <Card className="chapter-header mb-6 relative">
              {/* 主题设置按钮 */}
        <div className="absolute top-[2%] right-4 z-10">
          <div 
            onClick={() => setShowThemePanel(!showThemePanel)}
            className=" bg-transparent cursor-pointer dark:text-gray-400 border-0!  hover:shadow-xl transition-shadow duration-300 rounded-full p-3"
          ><Settings className="h-5 w-5" /></div>
        </div>
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
          <div className={`chapter-text p-8 transition-all duration-300  ${getFontSizeClasses(font)}  ${getBgThemeClasses(bg, document.documentElement.classList.contains('dark'))}`}>
            <div 
              className={`chapter-content-text prose max-w-none dark:prose-invert`} 
              dangerouslySetInnerHTML={{__html:formatContent(chapter.content)}}
            >
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
          <div className="flex justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <Link to={`/book/${chapter.bookId}`}>
              <Button className="bg-gray-100 w-32 rounded-xl hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white transition-colors duration-300">
                📚 返回目录
              </Button>
            </Link>
            <Link to="/">
              <Button className="bg-gray-100 w-32 rounded-xl hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white transition-colors duration-300">
                🏠 返回首页
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
