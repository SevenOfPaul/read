import { Button, Card } from "react-vant";
import { Link } from "react-router";
import type { RankingBook, RankingType, RankingConfig } from "../../types/rankingPage";
import { formatHeat } from "./index";
import MobileNavbar from "../../components/MobileNavbar";

interface RankingPageProps {
  currentTab: RankingType;
  onTabChange: (tab: RankingType) => void;
  rankingConfig: RankingConfig;
  books: RankingBook[];
  isLoading: boolean;
  error?: Error;
}

export default function Mobile({
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
    { key: 'heat' as RankingType, label: '热度榜', icon: '' },
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
      {/* 统一的移动端导航栏 */}
      <MobileNavbar
        title="排行榜"
        subtitle="发现热门精彩小说"
        showBack={true}
        showSearch={true}
        onBackClick={() => window.history.back()}
      />

      {/* 标签页切换 */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200 px-4 py-3 transition-colors duration-300">
        <div className="flex space-x-2">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.key;
            const config = {
              update: { bgColor: 'bg-blue-500', textColor: 'text-blue-500' },
              heat: { bgColor: 'bg-red-500', textColor: 'text-red-500' },
              words: { bgColor: 'bg-purple-500', textColor: 'text-purple-500' }
            }[tab.key];

            return (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className={`
                  flex-1 flex items-center justify-center space-x-1 py-3 px-3 rounded-lg text-sm font-medium transition-all duration-200 touch-target
                  ${isActive 
                    ? `${config.bgColor} text-white shadow-sm` 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }
                `}
              >
                <span className="text-base">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-4 py-4">
        {/* 当前榜单信息横幅 */}
        <div className={`${rankingConfig.bgColor} rounded-lg p-6 mb-6 text-white transition-colors duration-300`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-2 flex items-center">
                <span className="mr-2">{rankingConfig.icon}</span>
                {rankingConfig.title}
              </h2>
              <p className="text-sm mb-3 opacity-90">{rankingConfig.description}</p>
              <div className="flex items-center space-x-4 text-xs">
                <span>📚 当前: <span className="font-bold">{rankingConfig.title}</span></span>
                <span>📊 总数: <span className="font-bold">{books.length}</span></span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{books.length}</div>
              <div className="text-xs opacity-90">本精选</div>
            </div>
          </div>
          
          {/* 快捷按钮 */}
          <div className="grid grid-cols-2 gap-3">
            <Button 
              block 
              className="bg-white/20 hover:bg-white/30 border-0 h-12 text-white text-sm backdrop-blur-sm touch-target"
              onClick={() => {/* 可以添加搜索功能 */}}
            >
              🔍 搜索小说
            </Button>
            <Link to="/">
              <Button 
                block 
                className="bg-white/20 hover:bg-white/30 border-0 text-white h-12 text-sm backdrop-blur-sm touch-target"
              >
                🏠 返回首页
              </Button>
            </Link>
          </div>
        </div>

        {/* 排行榜列表 */}
        <div className="space-y-3">
          {books.length > 0 ? (
            books.map((book, index) => (
              <Card key={book.id} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <div className="p-4">
                  <div className="flex items-start space-x-3">
                    {/* 排名和封面 */}
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-2 ${
                        index === 0 ? 'bg-yellow-100 text-yellow-600 border-2 border-yellow-300' :
                        index === 1 ? 'bg-gray-100 text-gray-600 border-2 border-gray-300' :
                        index === 2 ? 'bg-orange-100 text-orange-600 border-2 border-orange-300' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {index + 1}
                      </div>
                      <img
                        src={book.bookImage || '/placeholder-book.jpg'}
                        alt={book.name}
                        className="w-14 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-book.jpg';
                        }}
                      />
                    </div>

                    {/* 书籍信息 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <Link to={`/book/${book.id}`}>
                            <h3 className="text-base font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-1 touch-target">
                              {book.name}
                            </h3>
                          </Link>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                            {book.desc}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
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
                      </div>

                      {/* 榜单特有信息 */}
                      <div className="flex items-center space-x-3 mt-2 text-sm">
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

                      {/* 最新章节和操作按钮 */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex-1">
                          {book.lastChapter && (
                            <div className="text-right">
                              <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">最新章节</p>
                              <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-1">
                                {book.lastChapter}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-2 ml-3">
                          <Link to={`/book/${book.id}`}>
                            <Button 
                              size="small" 
                              type="primary"
                              className="bg-blue-500 hover:bg-blue-600 border-0 text-xs h-8 touch-target"
                            >
                              详情
                            </Button>
                          </Link>
                          <Link to={`/book/${book.id}/1`}>
                            <Button 
                              size="small" 
                              className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white text-xs h-8 touch-target"
                            >
                              阅读
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            /* 空状态显示 */
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">{rankingConfig.icon}</span>
                </div>
                <h4 className="text-gray-400 dark:text-gray-400 font-medium mb-2">暂无数据</h4>
                <p className="text-gray-500 dark:text-gray-500 text-sm">
                  该榜单下暂时没有书籍，敬请期待更多精彩内容！
                </p>
              </div>
            </Card>
          )}
        </div>

        {/* 快捷导航 */}
        <Card className="mt-6 mb-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="p-4">
            <h4 className="text-gray-900 dark:text-white font-bold text-lg mb-4">🚀 快捷导航</h4>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/special/completed">
                <Button block className="bg-purple-100 dark:bg-purple-900/20 hover:bg-purple-200 dark:hover:bg-purple-800/30 border-0 text-purple-600 dark:text-purple-400 h-12 touch-target">
                  🏆 完结精品
                </Button>
              </Link>
              <Link to="/">
                <Button block className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-600 dark:text-gray-300 h-12 touch-target">
                  🏠 返回首页
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* 状态显示 */}
        {isLoading && (
          <Card className="mt-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <div className="p-8 text-center">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mr-3"></div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">正在加载{rankingConfig.title}数据...</div>
                  <div className="text-sm text-gray-400 dark:text-gray-400">请稍候</div>
              </div>
                </div>
            </div>
          </Card>
        )}
        
        {error && (
          <Card className="mt-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <div className="p-8 text-center">
              <div className="text-blue-400 mb-4">
                <div className="text-4xl mb-2">😵</div>
                <div className="font-medium text-gray-900 dark:text-white">加载失败</div>
                <div className="text-sm text-gray-400 dark:text-gray-400">
                  {error instanceof Error ? error.message : "未知错误"}
                </div>
              </div>
              <Button 
                type="primary"
                size="small"
                className="bg-blue-500 hover:bg-blue-600 border-0 touch-target"
                onClick={() => window.location.reload()}
              >
                🔄 重新加载
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* 移动端底部信息 */}
      <footer className="bg-gray-800 dark:bg-gray-800 border-t border-gray-700 dark:border-gray-700 py-6 mt-8 transition-colors duration-300">
        <div className="px-4 text-center">
          <h4 className="font-bold text-white mb-3 text-lg">🏆 排行榜</h4>
          <p className="text-sm text-gray-400 dark:text-gray-400 mb-4">汇聚全网最热门的精彩小说，帮你发现更多值得一读的好书</p>
          <div className="flex justify-center space-x-4 text-sm text-gray-500 dark:text-gray-500 mb-4">
            <span className="flex items-center">
              <span className="mr-1">🔄</span>
              更新
            </span>
            <span className="flex items-center">
              <span className="mr-1"></span>
              热度
            </span>
            <span className="flex items-center">
              <span className="mr-1">📚</span>
              字数
            </span>
          </div>
          <div className="border-t border-gray-700 dark:border-gray-700 pt-4">
            <p className="text-xs text-gray-500 dark:text-gray-500">
              © 2025 夜读小说网 · 专业的在线阅读平台
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
