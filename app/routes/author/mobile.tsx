import { Button, Card, Badge } from "react-vant";
import { 
  BookOpen, User, TrendingUp, Award, Heart, Eye, Star, 
  Crown, ChevronLeft, ChevronRight, ArrowLeft,
  AlertCircle, RefreshCw, Library, Flame, Zap, Home, Sparkles,
  Medal, Target
} from "lucide-react";
import { Link, useParams } from "react-router";
import type { AuthorBookInfo } from "../../types/authorPage";
import { formatHeat, formatDate } from "./index";
import MobileNavbar from "../../components/MobileNavbar";

interface AuthorPageProps {
  authorDetail?: {
    author: {
      id: string;
      name: string;
      isActive: boolean;
      createTime: Date;
      updateTime: Date;
    };
    books: AuthorBookInfo[];
    totalBooks: number;
    totalFired: number;
    latestUpdate?: Date;
  };
  isLoading: boolean;
  error?: Error;
}

export default function Mobile({
  authorDetail,
  isLoading,
  error
}: AuthorPageProps) {
  const { authorId } = useParams();

  // 截取描述为80字
  const truncateDesc = (desc: string) => {
    if (!desc) return '';
    return desc.length > 80 ? desc.substring(0, 80) + '...' : desc;
  };

  // 统计数据
  const totalBooks = authorDetail?.totalBooks || 0;
  const totalFired = authorDetail?.totalFired || 0;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        {/* 统一的移动端导航栏 */}
        <MobileNavbar
          title="作者信息"
          subtitle="精彩作品一览"
          showBack={true}
          showSearch={true}
          onBackClick={() => window.history.back()}
        />

        <div className="px-4 py-4">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <div className="p-8 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <h4 className="text-gray-900 dark:text-white font-medium mb-2">加载失败</h4>
              <p className="text-gray-500 dark:text-gray-500 text-sm mb-4">{error.message}</p>
              <Button 
                type="primary"
                size="small"
                className="bg-blue-500 hover:bg-blue-600 border-0 touch-target"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                重新加载
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* 统一的移动端导航栏 */}
      <MobileNavbar
        title="作者页面"
        subtitle="精彩作品一览"
        showBack={true}
        showSearch={true}
        onBackClick={() => window.history.back()}
      />

      <div className="px-4 py-4">
        {/* 作者信息横幅 */}
        <Card className="mb-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <Card.Body className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-2xl">
                    {authorDetail?.author.name?.charAt(0) || '作'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1 flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-yellow-500" />
                    {authorDetail?.author.name || '作者'}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                    入驻时间: {authorDetail?.author.createTime ? formatDate(authorDetail.author.createTime) : '-'}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-400 dark:text-gray-400">
                    <span className="flex items-center">
                      <Library className="h-3 w-3 mr-1" />
                      作品: <span className="text-gray-900 dark:text-white font-bold ml-1">{totalBooks}</span>
                    </span>
                    <span className="flex items-center">
                      <Flame className="h-3 w-3 mr-1 text-red-500" />
                      热度: <span className="text-red-500 font-bold ml-1">{formatHeat(totalFired)}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* 快捷功能区 */}
        <Card className="mb-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="p-4">
            <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-4 flex items-center">
              <Zap className="h-5 w-5 mr-2 text-yellow-500" />
              快捷操作
            </h3>
            <div className="space-y-2">
              <Button 
                block 
                className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white h-12 text-sm touch-target"
              >
                <Library className="h-4 w-4 mr-2" />
                我的书架
              </Button>
              <Link to="/" className="block">
                <Button 
                  block 
                  className="bg-blue-500 hover:bg-blue-600 border-0 text-white h-12 text-sm touch-target"
                >
                  <Home className="h-4 w-4 mr-2" />
                  返回首页
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* 作品列表标题 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-900 dark:text-white font-bold text-lg flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-yellow-500" />
              {authorDetail?.author.name || '作者'} 的作品
            </h3>
            <span className="text-sm text-gray-400 dark:text-gray-400">
              {totalBooks} 部
            </span>
          </div>
        </div>

        {/* 书籍列表 - 移动端垂直布局 */}
        <div className="space-y-4">
          {authorDetail?.books.map((book, index) => (
            <Card key={book.id} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-all duration-200 hover:shadow-lg">
              <Card.Body className="p-4">
                <div className="flex space-x-4">
                  {/* 书籍封面 */}
                  <div className="relative flex-shrink-0">
                    {book.bookImage && (
                      <img 
                        src={book.bookImage} 
                        alt={book.name}
                        className="w-20 h-28 object-cover rounded"
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
                          {index === 0 ? <Crown className="h-3 w-3 mr-1" /> : index === 1 ? <Medal className="h-3 w-3 mr-1" /> : <Award className="h-3 w-3 mr-1" />}
                          TOP{index + 1}
                        </div>
                      </div>
                    )}
                    
                    {/* 状态标签 */}
                    <div className="absolute -bottom-1 -right-1">
                      <span className={`${book.status.includes('连载') ? 'bg-green-500' : 'bg-blue-500'} text-white px-2 py-1 rounded text-xs font-bold`}>
                        {book.status}
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
                        
                        {/* 分类信息 */}
                        {book.category && (
                          <div className="flex items-center text-sm text-gray-400 dark:text-gray-400 mb-2">
                            <Library className="h-4 w-4 mr-1" />
                            <Link to={`/category/${book.categoryId}`} className="truncate hover:text-blue-500 cursor-pointer transition-colors">
                              {book.category}
                            </Link>
                          </div>
                        )}

                        {/* 书籍描述 - 移动端限制 */}
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                          {truncateDesc(book.desc)}
                        </p>

                        {/* 最新章节 */}
                        {book.lastChapter && (
                          <div className="mb-3 p-2 bg-gray-100 dark:bg-gray-600 rounded text-sm">
                            <div className="text-gray-600 dark:text-gray-300 flex items-center">
                              <BookOpen className="h-3 w-3 mr-1" />
                              最新: {book.lastChapter}
                            </div>
                          </div>
                        )}

                        {/* 热度标签 */}
                        {book.fired && (
                          <div className="mb-3">
                            <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold flex items-center w-fit">
                              <Flame className="h-3 w-3 mr-1" />
                              {formatHeat(book.fired)}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* 右侧操作区域 */}
                      <div className="flex-shrink-0 ml-3 flex flex-col items-end space-y-2">
                        <div className="flex items-center space-x-1">
                          <Flame className="h-4 w-4 text-red-500" />
                          <span className="text-sm text-gray-400 dark:text-gray-400">热门</span>
                        </div>
                        <Link to={`/book/${book.id}`}>
                          <Button 
                            size="small"
                            className="bg-blue-500 hover:bg-blue-600 border-0 text-sm px-3 py-1 font-bold touch-target"
                          >
                            <BookOpen className="h-4 w-4 mr-1" />
                            阅读
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}

          {/* 空状态显示 */}
          {(authorDetail?.books?.length || 0) === 0 && !isLoading && (
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-gray-400 dark:text-gray-400" />
                </div>
                <h4 className="text-gray-400 dark:text-gray-400 font-medium mb-2">暂无作品</h4>
                <p className="text-gray-500 dark:text-gray-500 text-sm">
                  该作者暂时没有公开作品，敬请期待更多精彩内容！
                </p>
              </div>
            </Card>
          )}
        </div>

        {/* 快捷功能区 */}
        <Card className="mt-6 mb-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="p-4">
            <h4 className="text-gray-900 dark:text-white font-bold text-lg mb-4 flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-blue-500" />
              相关推荐
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition-colors touch-target">
                <Target className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                <span className="text-xs text-gray-600 dark:text-gray-300">同类作者</span>
              </div>
              <Link to="/" className="text-center p-3 bg-blue-50 dark:bg-blue-900 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 cursor-pointer transition-colors touch-target">
                <Home className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                <span className="text-xs text-gray-600 dark:text-gray-300">返回首页</span>
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
                  <div className="font-medium text-gray-900 dark:text-white">正在加载作者信息...</div>
                  <div className="text-sm text-gray-400 dark:text-gray-400">请稍候</div>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* 移动端底部信息 */}
      <footer className="bg-gray-800 dark:bg-gray-800 border-t border-gray-700 dark:border-gray-700 py-6 mt-8 transition-colors duration-300">
        <div className="px-4 text-center">
          <h4 className="font-bold text-white mb-3 text-lg flex items-center justify-center">
            <Sparkles className="h-5 w-5 mr-2 text-yellow-500" />
            作者作品
          </h4>
          <p className="text-sm text-gray-400 dark:text-gray-400 mb-4">探索作者精彩世界 · 发现优质内容</p>
          <div className="flex justify-center space-x-4 text-sm text-gray-500 dark:text-gray-500 mb-4">
            <span className="flex items-center">
              <Award className="h-4 w-4 mr-1 text-blue-500" />
              品质
            </span>
            <span className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
              更新
            </span>
            <span className="flex items-center">
              <Heart className="h-4 w-4 mr-1 text-purple-500" />
              推荐
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
