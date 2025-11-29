import { BookOpen, Search, Moon, Sun } from "lucide-react";
import { Link } from "react-router";
import { useThemeStore } from "../lib/useThemeStore";


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
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <nav className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-8">
               <Link to="/">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h1>
                <p className="text-xs text-gray-400 dark:text-gray-400">{subtitle}</p>
              </div>
        
            </div>
                  </Link>
            {/* 主导航菜单 */}
            <div className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-black transition-colors">全部作品</a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-black transition-colors">排行榜</a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-black transition-colors">完本</a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-black transition-colors">新书</a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-black transition-colors">分类</a>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* 主题切换按钮 */}
            <button 
              className="p-2 cursor-pointer  hover:text-black hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
              onClick={toggleTheme}
              title={isDark ? "切换到白天模式" : "切换到黑夜模式"}
            >
              {isDark ? (
                <Sun className="h-5 w-5 dark:text-gray-300 text-gray-600 " />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            
            {showSearch && (
              <button 
                className="p-2  cursor-pointer  hover:text-black hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                onClick={handleSearch}
                title="搜索"
              >
                <Search className="h-5 w-5 dark:text-gray-300 text-gray-600" />
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
