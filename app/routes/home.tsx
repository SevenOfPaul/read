import { useQuery } from "@tanstack/react-query";
import { Button, Card, NavBar, Toast } from "react-vant";
import { BookOpen, Search } from "lucide-react";
import type { Route } from "./+types/home";

interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
}

async function fetchBooks(): Promise<Book[]> {
  // 模拟API调用
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, title: "React 18 实践指南", author: "开发者", category: "前端开发" },
        { id: 2, title: "Tailwind CSS 实战", author: "设计师", category: "CSS框架" },
        { id: 3, title: "移动端UI设计", author: "UI专家", category: "设计" },
      ]);
    }, 1000);
  });
}

export default function Home() {
  const { data: books, isLoading, error } = useQuery({
    queryKey: ['books'],
    queryFn: fetchBooks,
  });

  const handleSearch = () => {
    Toast.success("搜索功能开发中...");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* PC端顶部导航 */}
      <nav className="hidden md:block bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                图书管理系统
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 移动端Vant导航栏 */}
      <div className="md:hidden">
        <NavBar
          title="图书管理"
          left-arrow
          onClick-left={() => Toast("返回")}
          style={{ background: 'linear-gradient(135deg, #1989fa 0%, #1e88e5 100%)' }}
          className="text-white"
        />
      </div>

      <main className="container mx-auto px-4 py-6">
        {/* PC端布局 */}
        <div className="hidden md:block">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              欢迎使用图书管理系统
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              现代化的图书阅览和查询平台，支持PC和移动端访问
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {books && books.map((book: Book) => (
              <Card key={book.id} className="hover:shadow-lg transition-shadow">
                <Card.Header className="pb-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {book.title}
                  </h3>
                </Card.Header>
                <Card.Body>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    作者：{book.author}
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    {book.category}
                  </p>
                </Card.Body>
                <Card.Footer>
                  <Button type="primary" size="small" className="w-full">
                    开始阅读
                  </Button>
                </Card.Footer>
              </Card>
            ))}
          </div>
        </div>

        {/* 移动端布局 */}
        <div className="md:hidden space-y-4">
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              系统功能
            </h2>
            <div className="space-y-2">
              <Button 
                block 
                type="primary" 
                icon={<Search className="h-4 w-4" />}
                onClick={handleSearch}
                className="mb-2"
              >
                搜索图书
              </Button>
              <Button block type="default" icon={<BookOpen className="h-4 w-4" />}>
                我的书架
              </Button>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              推荐图书
            </h3>
            <div className="space-y-3">
              {books && books.map((book: Book) => (
                <div key={book.id} className="pb-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {book.title}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {book.author} · {book.category}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* 状态显示 */}
        {isLoading && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">加载中...</p>
          </div>
        )}
        
        {error && (
          <div className="text-center py-8">
            <p className="text-red-500">加载失败，请重试</p>
          </div>
        )}
      </main>

      {/* 配置信息显示 */}
      <footer className="mt-auto py-4 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>React 18 + Tailwind CSS + Vant + React Query 配置完成</p>
        <p className="mt-1">支持PC和移动端响应式设计</p>
      </footer>
    </div>
  );
}
