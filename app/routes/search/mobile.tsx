import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { Button, Card } from "react-vant";
import { Search, Clock, X, Filter, ArrowLeft } from "lucide-react";
import { useSearchBooks, useHotSearches } from "./index";
import type { SearchParams as SearchParamsType } from "../../types/search";
import MobileNavbar from "../../components/MobileNavbar";
import { Link } from "react-router";

export default function MobileSearch() {
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
      {/* 移动端导航栏 */}
      <MobileNavbar
        title="🔍 搜索小说"
        subtitle="发现您喜欢的故事"
        showBack={true}
        onBackClick={() => navigate("/")}
      />

      <div className="px-4 py-4">
        {/* 搜索输入区域 */}
        <Card className="mb-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="p-4">
            <div className="flex space-x-3">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="输入书名或作者名搜索..."
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                />
                {keyword && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
              <Button
                type="primary"
                onClick={handleSearch}
                disabled={!keyword.trim()}
                className="bg-blue-500 hover:bg-blue-600 border-0 px-6 py-3 touch-target"
              >
                搜索
              </Button>
            </div>
          </div>
        </Card>

        {/* 搜索状态显示 */}
        {searchQuery && (
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {isLoading ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full mr-2"></div>
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
                  className="text-blue-500 hover:text-blue-600 text-sm cursor-pointer"
                >
                  重新搜索
                </button>
              )}
            </div>
          </div>
        )}

        {/* 搜索历史和热门搜索 */}
        {showHistory && !searchQuery && (
          <div className="space-y-6">
            {/* 搜索历史 */}
            {searchHistory.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-gray-900 dark:text-white font-semibold flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-blue-500" />
                    搜索历史
                  </h3>
                  <button
                    onClick={clearHistory}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-sm cursor-pointer"
                  >
                    清空
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {searchHistory.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleHistoryClick(item)}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer transition-colors duration-200"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 热门搜索 */}
            {hotSearches.length > 0 && (
              <div>
                <h3 className="text-gray-900 dark:text-white font-semibold mb-3 flex items-center">
                  <Filter className="h-4 w-4 mr-2 text-blue-500" />
                  热门搜索
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {hotSearches.map((keyword, index) => (
                    <button
                      key={index}
                      onClick={() => handleHistoryClick(keyword)}
                      className="px-3 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:from-blue-100 hover:to-indigo-100 dark:hover:from-gray-600 dark:hover:to-gray-500 cursor-pointer transition-all duration-200 text-left"
                    >
                      <span className="text-blue-500 mr-2">🔥</span>
                      {keyword}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 搜索结果 */}
        {searchQuery && !showHistory && (
          <div>
            {isLoading && (
              <Card className="mb-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <div className="p-6 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mr-3"></div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">正在搜索...</div>
                      <div className="text-sm text-gray-400 dark:text-gray-400">请稍候</div>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {error && (
              <Card className="mb-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <div className="p-6 text-center">
                  <div className="text-red-500 mb-4">
                    <div className="text-3xl mb-2">😵</div>
                    <div className="font-medium text-gray-900 dark:text-white">搜索失败</div>
                    <div className="text-sm text-gray-400 dark:text-gray-400">
                      {error instanceof Error ? error.message : "未知错误"}
                    </div>
                  </div>
                  <Button 
                    type="primary"
                    size="small"
                    className="bg-blue-500 hover:bg-blue-600 border-0 touch-target"
                    onClick={() => setSearchParams({ q: searchQuery, page: '1' })}
                  >
                    🔄 重新搜索
                  </Button>
                </div>
              </Card>
            )}

            {searchResult && searchResult.books.length === 0 && (
              <Card className="mb-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <div className="p-6 text-center">
                  <div className="text-gray-500 mb-4">
                    <div className="text-3xl mb-2">📚</div>
                    <div className="font-medium text-gray-900 dark:text-white">未找到相关书籍</div>
                    <div className="text-sm text-gray-400 dark:text-gray-400">
                      试试换个关键词搜索吧
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {searchResult && searchResult.books.length > 0 && (
              <div className="space-y-4">
                {/* 书籍列表 */}
                {searchResult.books.map((book, index) => (
                  <Card key={book.id} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 touch-target">
                    <Card.Body className="p-4">
                      <div className="flex space-x-3">
                        {/* 书籍封面 */}
                        <div className="relative flex-shrink-0">
                          {book.bookImage && (
                            <img 
                              src={book.bookImage} 
                              alt={book.name}
                              className="w-16 h-20 object-cover rounded"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDIwMCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NiA2NEw5MCA3Nkw5NCA2NEgxMTBMMTMyIDEyOEwxMDggMTQ0SDkwSDEwOEw5NCAxMTZMMTAwIDEwOEw5NiA5Nkg4NlpNMTI0IDExMkwxMjggMTIwUTEyNiAxMzAgMTIyIDEzMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+";
                              }}
                            />
                          )}
                          {/* 排名徽章 */}
                          {index < 3 && (
                            <div className="absolute -top-1 -left-1">
                              <div className={`${index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-indigo-500' : 'bg-purple-500'} text-white px-2 py-1 rounded text-xs font-bold flex items-center`}>
                                {index === 0 ? '👑' : index === 1 ? '🥈' : '🥉'} TOP{index + 1}
                              </div>
                            </div>
                          )}
                          {/* 状态标签 */}
                          <div className="absolute -bottom-1 -right-1">
                            <span className={`${book.status?.includes('连载') ? 'bg-green-500' : 'bg-blue-500'} text-white px-2 py-1 rounded text-xs font-bold`}>
                              {book.status || '状态未知'}
                            </span>
                          </div>
                        </div>

                        {/* 书籍信息 */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h4 className="text-gray-900 dark:text-white font-bold text-base mb-2 line-clamp-2 leading-tight">
                                {book.name}
                              </h4>
                              
                              <div className="flex items-center text-sm text-gray-400 dark:text-gray-400 mb-3">
                                <span>👤 {book.author}</span>
                              </div>

                              {/* 书籍描述 */}
                              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                                {book.desc}
                              </p>

                              {/* 最新章节 */}
                              {book.lastChapter && (
                                <div className="mb-3 p-2 bg-gray-100 dark:bg-gray-600 rounded text-xs">
                                  <div className="text-gray-600 dark:text-gray-300">📖 最新: {book.lastChapter}</div>
                                </div>
                              )}
                            </div>
                            
                            {/* 右侧操作区域 */}
                            <div className="flex-shrink-0 ml-3 flex flex-col items-end space-y-2">
                              <div className="flex items-center space-x-1">
                                <span className="text-xs text-gray-400 dark:text-gray-400">🔥 热门</span>
                              </div>
                              <Link to={`/book/${book.id}`}>
                                <Button 
                                  size="small"
                                  className="bg-blue-500 hover:bg-blue-600 border-0 text-sm px-3 py-1 font-bold touch-target"
                                >
                                  📖 阅读
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
                  <Card className="mt-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          第 {searchResult.currentPage} 页，共 {searchResult.totalPages} 页
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="small"
                            disabled={searchResult.currentPage <= 1}
                            onClick={() => handlePageChange(searchResult.currentPage - 1)}
                            className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white touch-target"
                          >
                            上一页
                          </Button>
                          <Button
                            size="small"
                            disabled={searchResult.currentPage >= searchResult.totalPages}
                            onClick={() => handlePageChange(searchResult.currentPage + 1)}
                            className="bg-blue-500 hover:bg-blue-600 border-0 text-white touch-target"
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
      </div>

      {/* 移动端底部信息 */}
      <footer className="bg-gray-800 dark:bg-gray-800 border-t border-gray-700 dark:border-gray-700 py-6 mt-8 transition-colors duration-300">
        <div className="px-4 text-center">
          <h4 className="font-bold text-white mb-3 text-base">🔍 智能搜索</h4>
          <p className="text-sm text-gray-400 dark:text-gray-400 mb-4">精准匹配您喜欢的书籍</p>
          <div className="border-t border-gray-700 dark:border-gray-700 pt-4">
            <p className="text-xs text-gray-500 dark:text-gray-500">
              © 2025 夜读小说网 · 发现更多精彩故事
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
