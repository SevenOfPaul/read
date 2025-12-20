import { ArrowLeft, Menu, Search, MoreHorizontal } from "lucide-react";
import { Link } from "react-router";

interface MobileNavbarProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  showMenu?: boolean;
  showSearch?: boolean;
  onMenuClick?: () => void;
  onBackClick?: () => void;
  onSearchClick?: () => void;
  showDivider?: boolean;
  className?: string;
}

export default function MobileNavbar({
  title,
  subtitle,
  showBack = false,
  showMenu = false,
  showSearch = false,
  onMenuClick,
  onBackClick,
  onSearchClick,
  showDivider = true,
  className = ""
}: MobileNavbarProps) {
  // 搜索处理函数
  const handleSearch = () => {
    if (onSearchClick) {
      onSearchClick();
    } else {
      // 默认行为：跳转到搜索页面
      window.location.href = "/search";
    }
  };

  return (
    <>
      <nav className={`bg-white dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200 sticky top-0 z-50 transition-colors duration-300 ${className}`}>
        <div className="px-4">
          <div className="flex items-center justify-between py-3">
            {/* 左侧区域 */}
            <div className="flex items-center space-x-3">
              {showBack && (
                <Link 
                  to="/" 
                  onClick={onBackClick}
                  className="p-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 touch-target"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              )}
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 dark:bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-lg">📚</span>
                </div>
                <div className="min-w-0">
                  <h1 className="text-lg font-bold text-gray-900 dark:text-white truncate max-w-48">
                    {title}
                  </h1>
                  {subtitle && (
                    <p className="text-xs text-gray-500 dark:text-gray-300 truncate">
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            {/* 右侧区域 */}
            <div className="flex items-center space-x-2">
              {showSearch && (
                <button 
                  className="p-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 touch-target cursor-pointer"
                  onClick={handleSearch}
                  title="搜索"
                >
                  <Search className="h-5 w-5" />
                </button>
              )}
              
              {showMenu && (
                <button 
                  className="p-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 touch-target cursor-pointer"
                  onClick={onMenuClick}
                  title="菜单"
                >
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      {/* 分隔线 */}
      {showDivider && (
        <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
      )}
    </>
  );
}
