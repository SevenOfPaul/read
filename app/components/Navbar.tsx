import { BookOpen, Search } from "lucide-react";
import { Link } from "react-router";


interface NavbarProps {
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
}
function handleSearch() {
  console.log("搜索功能开发中...");
}
export default function Navbar({ 
  title = "夜读小说网", 
  subtitle = "精品小说 · 夜夜精彩",
  showSearch = true
}: NavbarProps) {
  return (
    <nav className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <Link to="/">
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h1>
                <p className="text-xs text-gray-400 dark:text-gray-400">{subtitle}</p>
              </div>
              </Link>
            </div>
            
            {/* 主导航菜单 */}
            <div className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-black transition-colors">全部作品</a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-black transition-colors">排行榜</a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-black transition-colors">完本</a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-black transition-colors">新书</a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-black transition-colors">分类</a>
            </div>
          </div>
          
          {showSearch && (
            <div className="flex items-center space-x-4">
              <button 
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-black hover:bg-gray-700 dark:hover:bg-gray-700 rounded-lg transition-colors"
                onClick={handleSearch}
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
