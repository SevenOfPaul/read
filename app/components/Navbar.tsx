import { BookOpen, Search, Moon, Sun } from "lucide-react";
import { Link, useLocation } from "react-router";
import { useThemeStore } from "../lib/useThemeStore";

interface NavbarProps {
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
}

function handleSearch() {
  console.log("搜索功能开发中...");
}

// 路径匹配逻辑，判断当前激活的菜单项
const getActiveMenuItem = (pathname: string) => {
  if (pathname === '/all' || pathname.startsWith('/home')) return 'all';
  if (pathname.startsWith('/book')) return 'books';
  if (pathname.startsWith('/category')) return 'category';
  if (pathname.includes('rank') || pathname.includes('ranking')) return 'rank';
  if (pathname.includes('complete') || pathname.includes('finished') || pathname.includes('/special/completed')) return 'complete';
  if (pathname.includes('new') || pathname.includes('latest') || pathname.includes('/special/new')) return 'new';
  return 'home'; // 默认返回首页
};

// 导航菜单项配置
const menuItems = [
  { key: 'rank', label: '排行榜', href: '/rank', isLink: true },
  { key: 'complete', label: '完结', href: '/special/completed', isLink: true },
  { key: 'new', label: '新书', href: '/special/new', isLink: true },
  { key: 'category', label: '分类', href: "/category/''", isLink: true },
    { key: 'rank', label: '我要上传', href: '/upload', isLink: false },
];

export default function Navbar({ 
  title = "夜读小说网", 
  subtitle = "精品小说 · 夜夜精彩",
  showSearch = true
}: NavbarProps) {
  const { isDark, toggleTheme } = useThemeStore();
  const location = useLocation();
  const activeMenuItem = getActiveMenuItem(location.pathname);

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
              {menuItems.map((item) => {
                const isActive = activeMenuItem === item.key;
                const linkClassName = `
                  px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-b-2 border-blue-600 dark:border-blue-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }
                `;
                
                if (item.isLink) {
                  return (
                    <Link 
                      key={item.key} 
                      to={item.href}
                      className={linkClassName}
                    >
                      {item.label}
                    </Link>
                  );
                } else {
                  return (
                    <a 
                      key={item.key} 
                      href="#"
                      className={linkClassName}
                      onClick={(e) => {
                        e.preventDefault();
                        // 这里可以添加导航逻辑，比如跳转到相应页面或显示模态框
                        console.log(`${item.label}功能开发中...`);
                      }}
                    >
                      {item.label}
                    </a>
                  );
                }
              })}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* 主题切换按钮 */}
            <button 
              className="p-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
              onClick={toggleTheme}
              title={isDark ? "切换到白天模式" : "切换到黑夜模式"}
            >
              {isDark ? (
                <Sun className="h-5 w-5 dark:text-gray-300 text-gray-600" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            
            {showSearch && (
              <button 
                className="p-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                onClick={handleSearch}
                title="搜索"
              >
                <Search className="h-5 w-5 dark:text-gray-300 text-gray-600" />
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* 移动端导航菜单 */}
      <div className="md:hidden border-t dark:border-gray-700 border-gray-200 bg-white dark:bg-gray-800">
        <div className="px-4 py-2">
          <div className="flex items-center justify-between space-x-1 overflow-x-auto">
            {menuItems.map((item) => {
              const isActive = activeMenuItem === item.key;
              const linkClassName = `
                px-3 py-2 rounded-md text-xs font-medium whitespace-nowrap transition-all duration-200
                ${isActive 
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }
              `;
              
              if (item.isLink) {
                return (
                  <Link 
                    key={item.key} 
                    to={item.href}
                    className={linkClassName}
                  >
                    {item.label}
                  </Link>
                );
              } else {
                return (
                  <a 
                    key={item.key} 
                    href="#"
                    className={linkClassName}
                    onClick={(e) => {
                      e.preventDefault();
                      console.log(`${item.label}功能开发中...`);
                    }}
                  >
                    {item.label}
                  </a>
                );
              }
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
