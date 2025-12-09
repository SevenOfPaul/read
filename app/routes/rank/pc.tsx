import { Button, Card } from "react-vant";
import { Link } from "react-router";
import type { RankingBook, RankingType, RankingConfig } from "../../types/rankingPage";
import Navbar from "../../components/Navbar";
import { formatHeat } from "./index";

interface RankingPageProps {
  currentTab: RankingType;
  onTabChange: (tab: RankingType) => void;
  rankingConfig: RankingConfig;
  books: RankingBook[];
  isLoading: boolean;
  error?: Error;
}

export default function PC({
  currentTab,
  onTabChange,
  rankingConfig,
  books,
  isLoading,
  error
}: RankingPageProps) {
  // 标签页配置
  const tabs = [
    { key: 'update' as RankingType, label: '更新榜', icon: '🔄' },
    { key: 'heat' as RankingType, label: '热度榜', icon: '🔥' },
    { key: 'words' as RankingType, label: '字数榜', icon: '📚' }
  ];

  // 格式化章节数量显示
  const formatChapterCount = (count?: number) => {
    if (!count) return '暂无';
    if (count >= 10000) {
      return `${(count / 10000).toFixed(1)}万章`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}千章`;
    } else {
      return `${count}章`;
    }
  };

  // 格式化更新时间显示
  const formatUpdateTime = (time?: Date) => {
    if (!time) return '未知';
    const now = new Date();
    const diff = now.getTime() - new Date(time).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      return hours > 0 ? `${hours}小时前` : '刚刚';
    } else if (days === 1) {
      return '昨天';
    } else if (days < 7) {
      return `${days}天前`;
    } else {
      return new Date(time).toLocaleDateString('zh-CN');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* 使用公共导航栏组件 */}
      <Navbar />

      <div className="max-w-7xl mx-auto pt-6 py-6 px-6">
        {/* 页面标题和描述 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
            🏆 排行榜
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            汇聚全网最热门的精彩小说，帮你发现更多值得一读的好书
          </p>
        </div>

        {/* 标签页切换 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {tabs.map((tab) => {
              const isActive = currentTab === tab.key;
              const config = {
                update: { bgColor: 'from-blue-500 to-cyan-600', textColor: 'text-blue-600' },
                heat: { bgColor: 'from-red-500 to-pink-600', textColor: 'text-red-600' },
                words: { bgColor: 'from-purple-500 to-indigo-600', textColor: 'text-purple-600' }
              }[tab.key];

              return (
                <button
                  key={tab.key}
                  onClick={() => onTabChange(tab.key)}
                  className={`
                    flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200
                    ${isActive 
                      ? `bg-white dark:bg-gray-800 ${config.textColor} shadow-sm` 
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                    }
                  `}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* 当前榜单信息 */}
          <div className={`mt-6 ${rankingConfig.bgColor} rounded-lg p-6 text-white`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2 flex items-center">
                  <span className="mr-2">{rankingConfig.icon}</span>
                  {rankingConfig.title}
                </h2>
                <p className="opacity-90">{rankingConfig.description}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{books.length}</div>
                <div className="text-sm opacity-90">本精选</div>
              </div>
            </div>
          </div>
        </div>

        {/* 排行榜列表 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          {books.length > 0 ? (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {books.map((book, index) => (
                <div key={book.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                  <div className="flex items-start space-x-4">
                    {/* 排名 */}
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0 ? 'bg-yellow-100 text-yellow-600 border-2 border-yellow-300' :
                      index === 1 ? 'bg-gray-100 text-gray-600 border-2 border-gray-300' :
                      index === 2 ? 'bg-orange-100 text-orange-600 border-2 border-orange-300' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {index + 1}
                    </div>

                    {/* 书籍封面 */}
                    <div className="flex-shrink-0">
                      <img
                        src={book.bookImage || '/placeholder-book.jpg'}
                        alt={book.name}
                        className="w-16 h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-book.jpg';
                        }}
                      />
                    </div>

                    {/* 书籍信息 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <Link to={`/book/${book.id}`}>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-1">
                              {book.name}
                            </h3>
                          </Link>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                            {book.desc}
                          </p>
                          
                          <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center">
                              <span className="mr-1">👤</span>
                              {book.author}
                            </span>
                            {book.categoryName && (
                              <span className="flex items-center">
                                <span className="mr-1">📁</span>
                                {book.categoryName}
                              </span>
                            )}
                            <span className="flex items-center">
                              <span className="mr-1">📖</span>
                              {book.status}
                            </span>
                          </div>

                          {/* 榜单特有信息 */}
                          <div className="flex items-center space-x-4 mt-2 text-sm">
                            {currentTab === 'heat' && (
                              <span className="text-red-500 font-medium">
                                {formatHeat(book.fired)}
                              </span>
                            )}
                            {currentTab === 'words' && (
                              <span className="text-purple-500 font-medium">
                                📚 {formatChapterCount(book.chapterCount)}
                              </span>
                            )}
                            {currentTab === 'update' && book.updateTime && (
                              <span className="text-blue-500 font-medium">
                                ⏰ {formatUpdateTime(book.updateTime)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* 最新章节 */}
                        {book.lastChapter && (
                          <div className="flex-shrink-0 ml-4 text-right">
                            <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">最新章节</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1 max-w-xs">
                              {book.lastChapter}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex-shrink-0 ml-4">
                      <div className="flex flex-col space-y-2">
                        <Link to={`/book/${book.id}`}>
                          <Button 
                            size="small" 
                            type="primary"
                            className="bg-blue-500 hover:bg-blue-600 border-0"
                          >
                            查看详情
                          </Button>
                        </Link>
                        <Link to={`/book/${book.id}`}>
                          <Button 
                            size="small" 
                            className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white"
                          >
                            开始阅读
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* 空状态显示 */
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">{rankingConfig.icon}</span>
              </div>
              <h4 className="text-gray-400 dark:text-gray-400 font-medium mb-2">暂无数据</h4>
              <p className="text-gray-500 dark:text-gray-500 text-sm">
                该榜单下暂时没有书籍，敬请期待更多精彩内容！
              </p>
            </div>
          )}
        </div>

        {/* 快捷导航 */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-4 flex items-center">
            <span className="mr-2">🚀</span>
            快捷导航
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/special/completed">
              <Button block className="bg-purple-100 dark:bg-purple-900/20 hover:bg-purple-200 dark:hover:bg-purple-800/30 border-0 text-purple-600 dark:text-purple-400">
                🏆 完结精品
              </Button>
            </Link>
            <Link to="/special/new">
              <Button block className="bg-blue-100 dark:bg-blue-900/20 hover:bg-blue-200 dark:hover:bg-blue-800/30 border-0 text-blue-600 dark:text-blue-400">
                ✨ 最新上架
              </Button>
            </Link>
            <Link to="/category/''">
              <Button block className="bg-green-100 dark:bg-green-900/20 hover:bg-green-200 dark:hover:bg-green-800/30 border-0 text-green-600 dark:text-green-400">
                📖 全部分类
              </Button>
            </Link>
            <Link to="/">
              <Button block className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-600 dark:text-gray-300">
                🏠 返回首页
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* 加载状态 */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center shadow-2xl transition-colors duration-300">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            <div className="text-gray-900 dark:text-white text-lg font-bold">正在加载{rankingConfig.title}数据...</div>
            <div className="text-gray-400 dark:text-gray-400 text-sm">请稍候，精彩即将呈现</div>
          </div>
        </div>
      )}
      
      {/* 错误状态 */}
      {error && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center shadow-2xl max-w-md transition-colors duration-300">
            <div className="text-6xl mb-4">😵</div>
            <h3 className="text-gray-900 dark:text-white text-xl font-bold mb-4">加载失败</h3>
            <p className="text-gray-400 dark:text-gray-400 mb-6">{error instanceof Error ? error.message : "网络连接出现问题"}</p>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-blue-500 hover:bg-blue-600 border-0"
            >
              🔄 重新加载
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
