import { Button, Card, NavBar, Toast } from "react-vant";
import { BookOpen, Search, Clock, User, TrendingUp, Award, Heart, Eye } from "lucide-react";
import type { CategoryWithBooks } from "../../../types/categorySearch";
import { useCategories, handleSearch } from "./index";

export default function Mobile() {
  const { data: categories, isLoading, error } = useCategories();

  const handleSearchClick = () => {
    Toast.success("搜索功能开发中，敬请期待！");
    handleSearch();
  };

  // 统计数据
  const totalBooks = categories?.reduce((sum, cat) => sum + (cat.books?.length || 0), 0) || 0;
  const categoriesWithBooks = categories?.filter(cat => cat.books && cat.books.length > 0) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 移动端导航栏 */}
      <NavBar
        title={
          <div className="flex items-center">
            <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center mr-2">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-lg">夜读小说网</div>
              <div className="text-amber-100 text-xs">发现你的专属故事</div>
            </div>
          </div>
        }
        left-arrow
        onClick-left={() => Toast("返回")}
        style={{ 
          background: '#8B4513'
        }}
        className="text-white"
      />

      <div className="px-4 py-4">
        {/* 欢迎区域 */}
        <div className="mb-6">
          <div className="bg-amber-600 rounded-lg p-6 text-white">
            <h2 className="text-xl font-bold mb-2">精品小说汇聚地</h2>
            <p className="text-amber-100 text-sm mb-4">精选优质小说 · 日更新 · 伴随每个夜晚</p>
            
            {/* 统计信息 */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-xl font-bold">{totalBooks}</div>
                <div className="text-xs text-amber-100">精品藏书</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold">{categoriesWithBooks.length}</div>
                <div className="text-xs text-amber-100">热门分类</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold">24H</div>
                <div className="text-xs text-amber-100">在线服务</div>
              </div>
            </div>
          </div>
        </div>

        {/* 功能按钮区 */}
        <Card className="mb-6">
          <div className="p-4 space-y-3">
            <Button 
              block 
              type="primary" 
              icon={<Search className="h-4 w-4" />}
              onClick={handleSearchClick}
              className="bg-amber-600 border-0 h-12"
            >
              搜索精彩小说
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                block 
                type="default" 
                className="border-amber-300 text-amber-700 h-10"
              >
                我的书架
              </Button>
              <Button 
                block 
                type="default" 
                className="border-red-300 text-red-700 h-10"
              >
                收藏历史
              </Button>
            </div>
          </div>
        </Card>

        {/* 营销横幅 */}
        <Card className="mb-6">
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <h4 className="font-semibold text-orange-700 mb-2">夜读时光</h4>
            <p className="text-sm text-gray-600">
              每晚22:00准时更新，好书不断陪伴你的阅读夜晚
            </p>
          </div>
        </Card>

        {/* 分类列表 */}
        <div className="space-y-4">
          {categories && categories.map((category: CategoryWithBooks) => {
            const hasBooks = category.books && category.books.length > 0;
            
            return (
              <Card key={category.id}>
                <Card.Header>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center mr-3">
                        <BookOpen className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">
                          {category.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {hasBooks ? (
                            <>
                              {category.books.length} 本精品 · 火热更新
                            </>
                          ) : (
                            '敬请期待'
                          )}
                        </p>
                      </div>
                    </div>
                    {hasBooks && (
                      <div className="flex space-x-1">
                        <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded">🔥热门</span>
                        <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded">✨新书</span>
                      </div>
                    )}
                  </div>
                </Card.Header>
                
                <Card.Body>
                  {hasBooks ? (
                    <div className="space-y-3">
                      <div className="flex space-x-3 overflow-x-auto pb-2">
                        {category.books.slice(0, 3).map((book) => (
                          <div key={book.id} className="flex-shrink-0 w-32">
                            <div className="bg-gray-50 rounded-lg p-3 border">
                              {book.bookImage && (
                                <div className="mb-2">
                                  <img 
                                    src={book.bookImage} 
                                    alt={book.name}
                                    className="w-full h-20 object-cover rounded"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDIwMCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NiA2NEw5MCA3Nkw5NCA2NEgxMTBMMTMyIDEyOEwxMDggMTQ0SDkwSDEwOEw5NCAxMTZMMTAwIDEwOEw5NiA5Nkg4NlpNMTI0IDExMkwxMjggMTIwUTEyNiAxMzAgMTIyIDEzMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+";
                                    }}
                                  />
                                </div>
                              )}
                              <h4 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1">
                                {book.name}
                              </h4>
                              <div className="space-y-1 mb-2">
                                <div className="flex items-center text-xs text-gray-500">
                                  <User className="h-3 w-3 mr-1" />
                                  <span className="truncate">{book.author}</span>
                                </div>
                                <div className="flex items-center text-xs text-gray-500">
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span className="truncate">{book.status}</span>
                                </div>
                              </div>
                              <Button 
                                size="small" 
                                className="w-full bg-amber-600 border-0 text-xs h-6"
                              >
                                阅读
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      {category.books.length > 3 && (
                        <div className="text-center">
                          <p className="text-xs text-gray-400">
                            还有 {category.books.length - 3} 本精彩书籍...
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* 空分类状态 */
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                        <BookOpen className="h-6 w-6 text-gray-400" />
                      </div>
                      <h4 className="font-semibold text-gray-500 mb-2">正在筹备中</h4>
                      <p className="text-sm text-gray-400">
                        我们正在精心挑选优质的{category.name}小说
                      </p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            );
          })}
        </div>

        {/* 移动端特色说明 */}
        <Card className="mt-6 mb-6">
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h4 className="font-semibold text-amber-700 mb-3 text-center">为什么选择夜读小说网？</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="flex items-center text-gray-700">
                  <Award className="h-4 w-4 mr-2 text-amber-500" />
                  精选优质内容
                </span>
                <span className="text-amber-500">✓</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center text-gray-700">
                  <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                  每日持续更新
                </span>
                <span className="text-green-500">✓</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center text-gray-700">
                  <Heart className="h-4 w-4 mr-2 text-red-500" />
                  个性化推荐
                </span>
                <span className="text-red-500">✓</span>
              </div>
            </div>
          </div>
        </Card>

        {/* 状态显示 */}
        {isLoading && (
          <Card className="mt-6">
            <div className="p-6 text-center">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-amber-500 border-t-transparent rounded-full mr-3"></div>
                <div>
                  <div className="font-medium">正在加载精彩小说...</div>
                  <div className="text-sm text-gray-500">请稍候</div>
                </div>
              </div>
            </div>
          </Card>
        )}
        
        {error && (
          <Card className="mt-6">
            <div className="p-6 text-center">
              <div className="text-red-500 mb-3">
                <div className="text-4xl mb-2">😵</div>
                <div className="font-medium">加载失败</div>
                <div className="text-sm">
                  {error instanceof Error ? error.message : "未知错误"}
                </div>
              </div>
              <Button 
                type="primary" 
                size="small"
                className="bg-amber-600 border-0"
                onClick={() => window.location.reload()}
              >
                重新加载
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* 移动端底部信息 */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-8">
        <div className="px-4 text-center">
          <h4 className="font-bold text-gray-900 mb-2">夜读小说网</h4>
          <p className="text-sm text-gray-600 mb-3">发现更多精彩故事</p>
          <div className="flex justify-center space-x-4 text-sm text-gray-500 mb-3">
            <span className="flex items-center">
              <Award className="h-4 w-4 mr-1 text-amber-500" />
              品质
            </span>
            <span className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
              更新
            </span>
            <span className="flex items-center">
              <Heart className="h-4 w-4 mr-1 text-red-500" />
              推荐
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
