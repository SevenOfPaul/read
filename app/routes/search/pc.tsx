import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { Button, Card } from "react-vant";
import { Search, Clock, X, Filter, BookOpen, Eye, User, TrendingUp } from "lucide-react";
import { useSearchBooks, useHotSearches } from "./index";
import type { SearchParams as SearchParamsType } from "../../types/search";
import Navbar from "../../components/Navbar";
import { Link } from "react-router";

export default function PcSearch() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get('q') || '');
  const [showHistory, setShowHistory] = useState(true);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // 获取搜索参数
  const searchQuery = searchParams.get('q') || '';
  const currentPage = parseInt(searchParams.get('page') || '1');

  // 搜索钩子
  const { data: searchResult, isLoading, error } = useSearchBooks({
    keyword: searchQuery,
    page: currentPage,
    pageSize: 20
  });

  // 热门搜索钩子
  const { data: hotSearches = [] } = useHotSearches();

  // 加载搜索历史
  useEffect(() => {
    const history = localStorage.getItem('searchHistory');
    if (history) {
      try {
        setSearchHistory(JSON.parse(history));
      } catch (e) {
        console.error('解析搜索历史失败:', e);
      }
    }
  }, []);

  // 保存搜索历史
  const saveToHistory = (searchKeyword: string) => {
    if (!searchKeyword.trim()) return;
    
    const newHistory = [searchKeyword, ...searchHistory.filter(item => item !== searchKeyword)].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  // 执行搜索
  const handleSearch = () => {
    const trimmedKeyword = keyword.trim();
    if (!trimmedKeyword) return;
    
    saveToHistory(trimmedKeyword);
    setSearchParams({ q: trimmedKeyword, page: '1' });
    setShowHistory(false);
  };

  // 清空搜索
  const clearSearch = () => {
    setKeyword('');
    setSearchParams({});
    setShowHistory(true);
  };

  // 点击历史搜索
  const handleHistoryClick = (historyKeyword: string) => {
    setKeyword(historyKeyword);
    saveToHistory(historyKeyword);
    setSearchParams({ q: historyKeyword, page: '1' });
    setShowHistory(false);
  };

  // 清空历史记录
  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  // 分页
  const handlePageChange = (page: number) => {
    setSearchParams({ q: searchQuery, page: page.toString() });
  };

  // 格式化总数显示
  const formatTotal = (total: number) => {
    if (total >= 10000) {
      return `约 ${(total / 10000).toFixed(1)}万`;
    } else if (total >= 1000) {
      return `约 ${(total / 1000).toFixed(1)}千`;
    }
    return total.toString();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* PC端导航栏 */}
      <Navbar title="夜读小说网" subtitle="精品小说 · 夜夜精彩" />

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* 页面标题区域 */}
        <div className="mb-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              🔍 搜索小说
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              发现您喜欢的精彩故事
            </p>
          </div>
        </div>

        {/* 搜索输入区域 */}
        <Card className="mb-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="p-6">
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-6 w-6 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="输入书名或作者名搜索..."
                  className="w-full pl-12 pr-12 py-4 text-lg border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                />
                {keyword && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                  >
                    <X className="h-6 w-6" />
                  </button>
                )}
              </div>
              <Button
                type="primary"
                onClick={handleSearch}
                disabled={!keyword.trim()}
                className="bg-blue-500 hover:bg-blue-600 border-0 px-8 py-4 text-lg font-bold"
              >
                🔍 搜索
              </Button>
            </div>
          </div>
        </Card>

        {/* 搜索状态显示 */}
        {searchQuery && (
          <div className="mb-6">
            <div className="flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="text-gray-600 dark:text-gray-400">
                {isLoading ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full mr-3"></div>
                    搜索中...
                  </span>
                ) : error ? (
                  <span className="text-red-500">搜索失败</span>
                ) : searchResult ? (
                  <span className="text-gray-600 dark:text-gray-400">
                    找到 <span className="font-semibold text-gray-900 dark:text-white">{formatTotal(searchResult.total)}</span> 本相关书籍
                  </span>
                ) : null}
              </div>
              {searchResult && searchResult.total > 0 && (
                <button
                  onClick={clearSearch}
                  className="text-blue-500 hover:text-blue-600 cursor-pointer"
                >
                  重新搜索
                </button>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 左侧侧边栏 - 搜索历史和热门搜索 */}
          <div className="lg:col-span-1">
            {/* 搜索历史 */}
            {showHistory && !searchQuery && searchHistory.length > 0 && (
              <Card className="mb-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-900 dark:text-white font-semibold flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-blue-500" />
                      搜索历史
                    </h3>
                    <button
                      onClick={clearHistory}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-sm cursor-pointer"
                    >
                      清空
                    </button>
                  </div>
                  <div className="space-y-2">
                    {searchHistory.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => handleHistoryClick(item)}
                        className="w-full text-left px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition-colors duration-200"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* 热门搜索 */}
            {showHistory && !searchQuery && hotSearches.length > 0 && (
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <div className="p-4">
                  <h3 className="text-gray-900 dark:text-white font-semibold mb-4 flex items-center">
                    <Filter className="h-5 w-5 mr-2 text-blue-500" />
                    热门搜索
                  </h3>
                  <div className="space-y-2">
                    {hotSearches.map((keyword, index) => (
                      <button
                        key={index}
                        onClick={() => handleHistoryClick(keyword)}
                        className="w-full text-left px-3 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:from-blue-100 hover:to-indigo-100 dark:hover:from-gray-600 dark:hover:to-gray-500 cursor-pointer transition-all duration-200 flex items-center"
                      >
                        <span className="text-blue-500 mr-3 text-lg">🔥</span>
                        {keyword}
                      </button>
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* 右侧内容区域 */}
          <div className="lg:col-span-3">
            {/* 搜索结果 */}
            {searchQuery && !showHistory && (
              <div>
                {isLoading && (
                  <Card className="mb-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
                    <div className="p-8 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mr-4"></div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white text-lg">正在搜索...</div>
                          <div className="text-gray-400 dark:text-gray-400">请稍候</div>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {error && (
                  <Card className="mb-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
                    <div className="p-8 text-center">
                      <div className="text-red-500 mb-6">
                        <div className="text-4xl mb-4">😵</div>
                        <div className="font-medium text-gray-900 dark:text-white text-xl">搜索失败</div>
                        <div className="text-gray-400 dark:text-gray-400">
                          {error instanceof Error ? error.message : "未知错误"}
                        </div>
                      </div>
                      <Button 
                        type="primary"
                        className="bg-blue-500 hover:bg-blue-600 border-0"
                        onClick={() => setSearchParams({ q: searchQuery, page: '1' })}
                      >
                        🔄 重新搜索
                      </Button>
                    </div>
                  </Card>
                )}

                {searchResult && searchResult.books.length === 0 && (
                  <Card className="mb-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
                    <div className="p-8 text-center">
                      <div className="text-gray-500 mb-6">
                        <div className="text-4xl mb-4">📚</div>
                        <div className="font-medium text-gray-900 dark:text-white text-xl">未找到相关书籍</div>
                        <div className="text-gray-400 dark:text-gray-400">
                          试试换个关键词搜索吧
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {searchResult && searchResult.books.length > 0 && (
                  <div className="space-y-6">
                    {/* 书籍列表 */}
                    {searchResult.books.map((book, index) => (
                      <Card key={book.id} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                        <Card.Body className="p-6">
                          <div className="flex space-x-4">
                            {/* 书籍封面 */}
                            <div className="relative flex-shrink-0">
                              {book.bookImage && (
                                <img 
                                  src={book.bookImage} 
                                  alt={book.name}
                                  className="w-20 h-24 object-cover rounded-lg"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDIwMCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NiA2NEw5MCA3Nkw5NCA2NEgxMTBMMTMyIDEyOEwxMDggMTQ0SDkwSDEwOEw5NCAxMTZMMTAwIDEwOEw5NiA5Nkg4NlpNMTI0IDExMkwxMjggMTIwUTEyNiAxMzAgMTIyIDEzMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+";
                                  }}
                                />
                              )}
                              {/* 排名徽章 */}
                              {index < 3 && (
                                <div className="absolute -top-2 -left-2">
                                  <div className={`${index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-indigo-500' : 'bg-purple-500'} text-white px-3 py-1 rounded-full text-sm font-bold flex items-center`}>
                                    {index === 0 ? '👑' : index === 1 ? '🥈' : '🥉'} TOP{index + 1}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* 书籍信息 */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-gray-900 dark:text-white font-bold text-xl mb-3 line-clamp-1">
                                    {book.name}
                                  </h3>
                                  
                                  <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4 space-x-4">
                                    <div className="flex items-center">
                                      <User className="h-4 w-4 mr-2" />
                                      <span>{book.author}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <Eye className="h-4 w-4 mr-2" />
                                      <span>🔥 热门</span>
                                    </div>
                                    <div className="flex items-center">
                                      <TrendingUp className="h-4 w-4 mr-2" />
                                      <span>{book.status || '状态未知'}</span>
                                    </div>
                                  </div>

                                  {/* 书籍描述 */}
                                  <p className="text-gray-600 dark:text-gray-300 text-base mb-4 line-clamp-3">
                                    {book.desc}
                                  </p>

                                  {/* 最新章节 */}
                                  {book.lastChapter && (
                                    <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-600 rounded-lg">
                                      <div className="text-gray-600 dark:text-gray-300 flex items-center">
                                        <BookOpen className="h-4 w-4 mr-2" />
                                        最新: {book.lastChapter}
                                      </div>
                                    </div>
                                  )}
                                </div>
                                
                                {/* 右侧操作区域 */}
                                <div className="flex-shrink-0 ml-6 flex flex-col items-end space-y-3">
                                  <div className="text-right">
                                    <div className="text-2xl font-bold text-blue-500 mb-1">
                                      #{index + 1}
                                    </div>
                                    <div className="text-sm text-gray-400">搜索排名</div>
                                  </div>
                                  <Link to={`/book/${book.id}`}>
                                    <Button 
                                      className="bg-blue-500 hover:bg-blue-600 border-0 text-base px-6 py-3 font-bold"
                                    >
                                      📖 立即阅读
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    ))}

                    {/* 分页组件 */}
                    {searchResult.totalPages > 1 && (
                      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
                        <div className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="text-gray-600 dark:text-gray-400">
                              第 {searchResult.currentPage} 页，共 {searchResult.totalPages} 页，共 {searchResult.total} 本书
                            </div>
                            <div className="flex space-x-3">
                              <Button
                                disabled={searchResult.currentPage <= 1}
                                onClick={() => handlePageChange(searchResult.currentPage - 1)}
                                className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white"
                              >
                                上一页
                              </Button>
                              <Button
                                disabled={searchResult.currentPage >= searchResult.totalPages}
                                onClick={() => handlePageChange(searchResult.currentPage + 1)}
                                className="bg-blue-500 hover:bg-blue-600 border-0 text-white"
                              >
                                下一页
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 初始状态 - 显示引导信息 */}
            {!searchQuery && showHistory && (
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <div className="p-12 text-center">
                  <div className="text-6xl mb-6">🔍</div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    欢迎使用智能搜索
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
                    输入书名或作者名，快速找到您喜欢的书籍
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                    <div className="p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
                      <div className="text-2xl mb-2">🎯</div>
                      <div className="font-semibold text-gray-900 dark:text-white">精准搜索</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">支持书名和作者名搜索</div>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-gray-700 rounded-lg">
                      <div className="text-2xl mb-2">⚡</div>
                      <div className="font-semibold text-gray-900 dark:text-white">极速响应</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">毫秒级搜索体验</div>
                    </div>
                    <div className="p-4 bg-purple-50 dark:bg-gray-700 rounded-lg">
                      <div className="text-2xl mb-2">📚</div>
                      <div className="font-semibold text-gray-900 dark:text-white">海量藏书</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">千万本优质小说</div>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
