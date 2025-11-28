import { Button, Card } from "react-vant";
import { BookOpen, Search, Clock, User, TrendingUp, Award, Heart, Eye } from "lucide-react";
import type { CategoryWithBooks } from "../../../types/categorySearch";
import { useCategories, handleSearch } from "./index";

export default function PC() {
  const { data: categories, isLoading, error } = useCategories();

  // 统计数据
  const totalBooks = categories?.reduce((sum, cat) => sum + (cat.books?.length || 0), 0) || 0;
  const categoriesWithBooks = categories?.filter(cat => cat.books && cat.books.length > 0) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="novel-container">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <div className="novel-logo-icon">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="novel-title">夜读小说网</h1>
                <p className="text-sm text-gray-500">发现你的专属故事世界</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                className="p-2 text-gray-600 hover:text-amber-700 rounded-lg hover:bg-gray-100"
                onClick={handleSearch}
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {/* 二级导航菜单 */}
          <div className="novel-nav">
            <a href="#" className="active">首页</a>
            <a href="#">分类</a>
            <a href="#">排行榜</a>
            <a href="#">完本</a>
            <a href="#">新书</a>
            <a href="#">我的书架</a>
          </div>
        </div>
      </nav>

      <main className="novel-container py-8">
        {/* 英雄区域 */}
        <div className="text-center mb-12">
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              精品小说汇聚地
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              精选优质小说 · 每日更新 · 伴随每个阅读时光
            </p>
            <div className="flex justify-center items-center space-x-12">
              <div className="text-center">
                <div className="stat-number">{totalBooks}</div>
                <div className="text-gray-600">精品藏书</div>
              </div>
              <div className="text-center">
                <div className="stat-number">{categoriesWithBooks.length}</div>
                <div className="text-gray-600">精选分类</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">24H</div>
                <div className="text-gray-600">日更不断</div>
              </div>
            </div>
          </div>
        </div>

        {/* 分类展示区域 */}
        <div className="space-y-8">
          {categories && categories.map((category: CategoryWithBooks) => {
            const hasBooks = category.books && category.books.length > 0;
            
            return (
              <div key={category.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* 分类头部 */}
                <div className="category-header">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h2 className="category-title">
                          <BookOpen className="h-5 w-5 text-amber-600" />
                          {category.name}
                        </h2>
                        <p className="category-stats">
                          {hasBooks ? (
                            <>
                              {category.books.length} 本精品小说 · 正在火热更新
                            </>
                          ) : (
                            '敬请期待精彩内容'
                          )}
                        </p>
                      </div>
                    </div>
                    {hasBooks && (
                      <div className="flex space-x-2">
                        <span className="tag tag-hot">🔥 热门</span>
                        <span className="tag tag-new">✨ 新书</span>
                        <span className="tag tag-recommend">📚 精品</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 书籍展示 */}
                <div className="p-6">
                  {hasBooks ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-3">
                      {category.books.map((book) => (
                        <Card key={book.id} className="book-card">
                          <Card.Body className="p-0">
                            {book.bookImage && (
                              <img 
                                src={book.bookImage} 
                                alt={book.name}
                                className="book-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDIwMCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NiA2NEw5MCA3Nkw5NCA2NEgxMTBMMTMyIDEyOEwxMDggMTQ0SDkwSDEwOEw5NCAxMTZMMTAwIDEwOEw5NiA5Nkg4NlpNMTI0IDExMkwxMjggMTIwUTEyNiAxMzAgMTIyIDEzMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+";
                                }}
                              />
                            )}
                            <div className="p-4">
                              <h4 className="book-title">{book.name}</h4>
                              <div className="space-y-2 mb-3">
                                <div className="book-author">
                                  <User className="h-4 w-4" />
                                  <span>{book.author}</span>
                                </div>
                                <div className="book-author">
                                  <Clock className="h-4 w-4" />
                                  <span>{book.status}</span>
                                </div>
                              </div>
                              {book.lastChapter && (
                                <div className="mb-3 p-3 bg-blue-50 rounded text-sm">
                                  <div className="font-medium text-blue-700 mb-1">最新章节</div>
                                  <p className="text-gray-600">{book.lastChapter}</p>
                                </div>
                              )}
                              <p className="book-desc">{book.desc}</p>
                              <div className="mt-3 flex items-center justify-between">
                                <span className="book-status">{book.status}</span>
                                <Button 
                                  type="primary" 
                                  size="small"
                                  className="bg-amber-600 hover:bg-amber-700 border-0"
                                >
                                  立即阅读
                                </Button>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    /* 空分类状态 */
                    <div className="text-center py-16">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-500 mb-2">
                        精彩即将呈现
                      </h3>
                      <p className="text-gray-400">
                        我们正在精心策划优质的{category.name}小说内容，敬请期待！
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 加载状态 */}
        {isLoading && (
          <div className="loading">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <div className="text-lg">正在加载精彩内容...</div>
          </div>
        )}
        
        {/* 错误状态 */}
        {error && (
          <div className="error">
            <div className="text-6xl mb-4">😵</div>
            <h3 className="text-xl font-medium mb-2">加载失败</h3>
            <p className="mb-4">{error instanceof Error ? error.message : "网络连接出现问题"}</p>
            <Button 
              type="primary" 
              onClick={() => window.location.reload()}
            >
              重新加载
            </Button>
          </div>
        )}
      </main>

      {/* 底部信息 */}
      <footer className="bg-white border-t border-gray-200 py-12 mt-16">
        <div className="novel-container text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            夜读小说网 - 你的专属阅读伙伴
          </h3>
          <p className="text-gray-600 mb-6">
            发现更多精彩故事，享受沉浸式阅读时光
          </p>
          <div className="flex justify-center space-x-8">
            <div className="flex items-center space-x-2 text-gray-500">
              <Award className="h-5 w-5 text-amber-600" />
              <span>品质保证</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-500">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span>持续更新</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-500">
              <Heart className="h-5 w-5 text-red-600" />
              <span>用户至上</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
