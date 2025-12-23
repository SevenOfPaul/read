import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { Button, Card } from "react-vant";
import {
  Search,
  Clock,
  X,
  BookOpen,
  Eye,
  User,
  TrendingUp,
  Flame,
  RefreshCw,
  Crown,
  Medal,
  Award,
  Target,
  Zap,
  Library
} from "lucide-react";
import { useSearchBooks, useHotSearches } from "./index";
import type { SearchResult as SearchResultType } from "../../types/search";
import type { BookInfo } from "../../types/categorySearch";
import Navbar from "../../components/Navbar";
import { Link } from "react-router";

export default function PcSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get('q') || '');
  const [showHistory, setShowHistory] = useState(true);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const searchQuery = searchParams.get('q') || '';
  const currentPage = parseInt(searchParams.get('page') || '1');

  const { data: searchResult, isLoading, error } = useSearchBooks({
    keyword: searchQuery,
    page: currentPage,
    pageSize: 20
  });

  const { data: hotSearches = [] } = useHotSearches();

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

  const saveToHistory = (searchKeyword: string) => {
    if (!searchKeyword.trim()) return;
    
    const newHistory = [searchKeyword, ...searchHistory.filter(item => item !== searchKeyword)].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  const handleSearch = () => {
    const trimmedKeyword = keyword.trim();
    if (!trimmedKeyword) return;
    
    saveToHistory(trimmedKeyword);
    setSearchParams({ q: trimmedKeyword, page: '1' });
    setShowHistory(false);
  };

  const clearSearch = () => {
    setKeyword('');
    setSearchParams({});
    setShowHistory(true);
  };

  const handleHistoryClick = (historyKeyword: string) => {
    setKeyword(historyKeyword);
    saveToHistory(historyKeyword);
    setSearchParams({ q: historyKeyword, page: '1' });
    setShowHistory(false);
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  const handlePageChange = (page: number) => {
    setSearchParams({ q: searchQuery, page: page.toString() });
  };

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
      <Navbar title="夜读小说网" subtitle="精品小说 · 夜夜精彩" />

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="mb-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center">
              <Search className="h-8 w-8 mr-3 text-blue-500" />
              搜索小说
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              发现您喜欢的精彩故事
            </p>
          </div>
        </div>

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
                className="bg-blue-500 hover:bg-blue-600 border-0 px-8 py-4 text-lg font-bold cursor-pointer"
              >
                <Search className="h-5 w-5 mr-2" />
                搜索
              </Button>
            </div>
          </div>
        </Card>

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
                  className="text-blue-500 hover:text-blue-600 cursor-pointer flex items-center"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  重新搜索
                </button>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
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

            {showHistory && !searchQuery && hotSearches.length > 0 && (
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <div className="p-4">
                  <h3 className="text-gray-900 dark:text-white font-semibold mb-4 flex items-center">
                    <Flame className="h-5 w-5 mr-2 text-red-500" />
                    热门搜索
                  </h3>
                  <div className="space-y-2">
                    {hotSearches.map((hotKeyword, index) => (
                      <button
                        key={index}
                        onClick={() => handleHistoryClick(hotKeyword)}
                        className="w-full text-left px-3 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:from-blue-100 hover:to-indigo-100 dark:hover:from-gray-600 dark:hover:to-gray-500 cursor-pointer transition-all duration-200 flex items-center"
                      >
                        <Flame className="h-4 w-4 mr-3 text-red-500" />
                        {hotKeyword}
                      </button>
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </div>

          <div className="lg:col-span-3">
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
                        <div className="flex justify-center mb-4">
                          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                            <Target className="h-12 w-12 text-red-500 mx-auto" />
                          </div>
                        </div>
                        <div className="font-medium text-gray-900 dark:text-white text-xl">搜索失败</div>
                        <div className="text-gray-400 dark:text-gray-400">
                          {error instanceof Error ? error.message : "未知错误"}
                        </div>
                      </div>
                      <Button 
                        type="primary"
                        className="bg-blue-500 hover:bg-blue-600 border-0 cursor-pointer"
                        onClick={() => setSearchParams({ q: searchQuery, page: '1' })}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        重新搜索
                      </Button>
                    </div>
                  </Card>
                )}

                {searchResult && searchResult.books.length === 0 && (
                  <Card className="mb-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
                    <div className="p-8 text-center">
                      <div className="text-gray-500 mb-6">
                        <div className="flex justify-center mb-4">
                          <Library className="h-16 w-16 text-gray-400 mx-auto" />
                        </div>
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
                    {searchResult.books.map((book, index) => (
                      <Card key={book.id} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                        <Card.Body className="p-6">
                          <div className="flex space-x-4">
                            <div className="relative flex-shrink-0">
                              {book.bookImage && (
                                <img 
                                  src={book.bookImage} 
                                  alt={book.name}
                                  className="w-20 h-24 object-cover rounded-lg"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDIwMCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NiA2NEw5MCA3Nkw5NCA2NEgxMTBMMTMyIDEyOEwxMDggMTQ0SDkwSDEwOEw5NCAxMTZMMTAwIDEwOEw5NiA5Nkg4NlpNMTI0IDExMTEyMFExMmwMTI4IDYgMTMwIDEyMiAxMzBaIiBmaWxsPSIjOUFDMUFGIi8+Cjwvc3ZnPg==";
                                  }}
                                />
                              )}
                              {index < 3 && (
                                <div className="absolute -top-2 -left-2">
                                  <div className={`${index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-indigo-500' : 'bg-purple-500'} text-white px-3 py-1 rounded-full text-sm font-bold flex items-center`}>
                                    {index === 0 ? <Crown className="h-4 w-4 mr-1" /> : index === 1 ? <Medal className="h-4 w-4 mr-1" /> : <Award className="h-4 w-4 mr-1" />}
                                    TOP{index + 1}
                                  </div>
                                </div>
                              )}
                            </div>

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
                                      <span className="flex items-center">
                                        <Flame className="h-3 w-3 mr-1 text-red-500" />
                                        热门
                                      </span>
                                    </div>
                                    <div className="flex items-center">
                                      <TrendingUp className="h-4 w-4 mr-2" />
                                      <span>{book.status || '状态未知'}</span>
                                    </div>
                                  </div>

                                  <p className="text-gray-600 dark:text-gray-300 text-base mb-4 line-clamp-3">
                                    {book.desc}
                                  </p>

                                  {book.lastChapter && (
                                    <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                      <div className="text-gray-600 dark:text-gray-300 flex items-center">
                                        <BookOpen className="h-4 w-4 mr-2" />
                                        最新: {book.lastChapter}
                                      </div>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex-shrink-0 ml-6 flex space-y-3 flex-col items-end">
                                  <div className="text-right">
                                    <div className="text-2xl font-bold text-blue-500 mb-1">
                                      #{index + 1}
                                    </div>
                                    <div className="text-sm text-gray-400">搜索排名</div>
                                  </div>
                                  <Link to={`/book/${book.id}`}>
                                    <Button
                                      type="primary"
                                      className="bg-blue-500 hover:bg-blue-600 border-0 text-base px-6 py-3 font-bold cursor-pointer"
                                    >
                                      <BookOpen className="h-4 w-4 mr-2" />
                                      立即阅读
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    ))}

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
                                className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white cursor-pointer"
                              >
                                上一页
                              </Button>
                              <Button
                                disabled={searchResult.currentPage >= searchResult.totalPages}
                                onClick={() => handlePageChange(searchResult.currentPage + 1)}
                                className="bg-blue-500 hover:bg-blue-600 border-0 text-white cursor-pointer"
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

            {!searchQuery && showHistory && (
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <div className="p-12 text-center">
                  <Search className="h-16 w-16 mx-auto mb-6 text-blue-500" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center">
                    <Target className="h-6 w-6 mr-2 text-blue-500" />
                    欢迎使用智能搜索
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
                    输入书名或作者名，快速找到您喜欢的书籍
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                    <div className="p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
                      <Target className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                      <div className="font-semibold text-gray-900 dark:text-white">精准搜索</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">支持书名和作者名搜索</div>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-gray-700 rounded-lg">
                      <Zap className="h-8 w-8 mx-auto mb-2 text-green-500" />
                      <div className="font-semibold text-gray-900 dark:text-white">极速响应</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">毫秒级搜索体验</div>
                    </div>
                    <div className="p-4 bg-purple-50 dark:bg-gray-700 rounded-lg">
                      <Library className="h-8 w-8 mx-auto mb-2 text-purple-500" />
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
