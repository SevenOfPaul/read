import { useState } from "react";
import { Button, Card, Badge } from "react-vant";
import { 
  BookOpen, Search, Clock, User, TrendingUp, Award, Heart, Eye, Star, 
  Crown, BookMarked, Menu, Filter, X, ChevronLeft, ChevronRight, MoreHorizontal 
} from "lucide-react";
import { Link, useParams } from "react-router";
import type { BookInfo } from "@/types/categorySearch";
import type { PaginationInfo } from "@/types/categoryPage";
import type { SpecialConfig } from "@/types/specialPage";
import { formatHeat } from "./index";
import BookCard from "@/components/BookCard";

interface SpecialPageProps {
  specialConfig: SpecialConfig;
  books: BookInfo[];
  pagination: PaginationInfo;
  isLoading: boolean;
  error?: Error;
  onPageChange: (page: number) => void;
}

export default function Mobile({
  specialConfig,
  books,
  pagination,
  isLoading,
  error,
  onPageChange
}: SpecialPageProps) {
  const { type } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* 顶部导航栏 */}
      <nav className={`${specialConfig.bgColor} border-b-0 border-gray-700 sticky top-0 z-50 transition-colors duration-300`}>
        <div className="px-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">{specialConfig.title}</h1>
                  <p className="text-xs text-white/80">发现更多精彩 · {specialConfig.description}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
                onClick={() => {/* 可以添加更多功能 */}}
              >
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 专题类型选择器 */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200 px-4 py-3 transition-colors duration-300">
        <div className="flex space-x-2">
          <Link
            to="/special/completed"
            className={`flex-1 py-2 px-4 rounded-lg text-center transition-colors ${
              type === 'completed'
                ? specialConfig.bgColor.replace('bg-gradient-to-r from-', 'bg-').replace(' to-', '-').replace('-600', '-500') + ' text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <div className="flex items-center justify-center space-x-1">
              <span className="text-lg">🏆</span>
              <span className="font-medium">完结精品</span>
            </div>
          </Link>
          <Link
            to="/special/new"
            className={`flex-1 py-2 px-4 rounded-lg text-center transition-colors ${
              type === 'new'
                ? specialConfig.bgColor.replace('bg-gradient-to-r from-', 'bg-').replace(' to-', '-').replace('-600', '-500') + ' text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <div className="flex items-center justify-center space-x-1">
              <span className="text-lg">✨</span>
              <span className="font-medium">最新上架</span>
            </div>
          </Link>
        </div>
      </div>

      <div className="px-4 py-4">
        {/* 专题信息横幅 */}
        <div className={`${specialConfig.bgColor} rounded-lg p-6 mb-6 text-white transition-colors duration-300`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">
                {specialConfig.icon} {specialConfig.title}
              </h2>
              <p className="text-sm mb-4 opacity-90">{specialConfig.description}</p>
              <div className="flex items-center space-x-4 text-xs">
                <span>📚 当前: <span className="font-bold">{specialConfig.title}</span></span>
                <span>📊 总数: <span className="font-bold">{pagination.total}</span></span>
                <span>📄 页码: <span className="font-bold">{pagination.currentPage}</span></span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{pagination.total}</div>
              <div className="text-sm opacity-90">{type=='new'?"连载":"完结"}</div>
            </div>
          </div>
          
          {/* 快捷按钮 */}
          <div className="grid grid-cols-2 gap-3">
            <Button 
              block 
              type="primary"
              className="bg-white/20 hover:bg-white/30 border-0 h-10 text-white text-sm backdrop-blur-sm"
            >
              🔍 搜索小说
            </Button>
            <Link to="/">
              <Button 
                block 
                className="bg-white/20 hover:bg-white/30 border-0 text-white h-10 text-sm backdrop-blur-sm"
              >
                🏠 返回首页
              </Button>
            </Link>
          </div>
        </div>

        {/* 筛选工具栏 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-900 dark:text-white font-bold text-lg">
              ✨ {specialConfig.title} 书籍
            </h3>
            <span className="text-sm text-gray-400 dark:text-gray-400">
              {pagination.total} 本
            </span>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <Button size="small" className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white">
              <Award className="h-4 w-4 mr-1" />
              最新
            </Button>
            <Button size="small" className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white">
              <TrendingUp className="h-4 w-4 mr-1" />
              热门
            </Button>
            <Button size="small" className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white">
              <Heart className="h-4 w-4 mr-1" />
              收藏
            </Button>
          </div>
        </div>

        {/* 书籍列表 - 使用BookCard组件 */}
        <div className="space-y-4">
          {books.map((book, index) => (
            <BookCard 
              key={book.id}
              book={book}
              layout="mobile"
              showRank={true}
              rank={index}
              truncateLength={80}
            />
          ))}

          {/* 空状态显示 */}
          {books.length === 0 && !isLoading && (
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">{specialConfig.icon}</span>
                </div>
                <h4 className="text-gray-400 dark:text-gray-400 font-medium mb-2">暂无书籍</h4>
                <p className="text-gray-500 dark:text-gray-500 text-sm">
                  该专题下暂时没有书籍，敬请期待更多精彩内容！
                </p>
              </div>
            </Card>
          )}
        </div>

        {/* 分页组件 - 移动端简化版 */}
        {pagination.totalPages > 1 && (
          <Card className="mt-6 mb-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-gray-600 dark:text-gray-300 text-sm">
                  第 {pagination.currentPage} 页 / 共 {pagination.totalPages} 页
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button 
                    size="small"
                    disabled={pagination.currentPage === 1}
                    onClick={() => onPageChange(pagination.currentPage - 1)}
                    className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <span className="px-3 py-1 bg-blue-500 text-white rounded text-sm font-bold">
                    {pagination.currentPage}
                  </span>
                  
                  <Button 
                    size="small"
                    disabled={pagination.currentPage === pagination.totalPages}
                    onClick={() => onPageChange(pagination.currentPage + 1)}
                    className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white disabled:opacity-50"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* 页码选择器 */}
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-5 gap-2">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.currentPage >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = pagination.currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        size="small"
                        type={pagination.currentPage === pageNum ? "primary" : "default"}
                        onClick={() => onPageChange(pageNum)}
                        className={pagination.currentPage === pageNum 
                          ? "bg-blue-500 border-0" 
                          : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white"
                        }
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* 快捷功能区 */}
        <Card className="mb-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="p-4">
            <h4 className="text-gray-900 dark:text-white font-bold text-lg mb-4">⚡ 快捷功能</h4>
            <div className="grid grid-cols-3 gap-3">
              <Link to="/special/completed" className="text-center p-3 bg-purple-50 dark:bg-purple-900 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-800 cursor-pointer transition-colors">
                <BookOpen className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                <span className="text-xs text-gray-600 dark:text-gray-300">完结精品</span>
              </Link>
              <Link to="/special/new" className="text-center p-3 bg-blue-50 dark:bg-blue-900 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 cursor-pointer transition-colors">
                <Award className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                <span className="text-xs text-gray-600 dark:text-gray-300">最新上架</span>
              </Link>
              <Link to="/" className="text-center p-3 bg-green-50 dark:bg-green-900 rounded-lg hover:bg-green-100 dark:hover:bg-green-800 cursor-pointer transition-colors">
                <Crown className="h-6 w-6 mx-auto mb-2 text-green-500" />
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
                  <div className="font-medium text-gray-900 dark:text-white">正在加载{specialConfig.title}数据...</div>
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
                className="bg-blue-500 hover:bg-blue-600 border-0"
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
          <h4 className="font-bold text-white mb-3 text-lg">{specialConfig.icon} {specialConfig.title}</h4>
          <p className="text-sm text-gray-400 dark:text-gray-400 mb-4">{specialConfig.description}</p>
          <div className="flex justify-center space-x-4 text-sm text-gray-500 dark:text-gray-500 mb-4">
            <span className="flex items-center">
              <Award className="h-4 w-4 mr-1 text-purple-500" />
              品质
            </span>
            <span className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-1 text-blue-500" />
              更新
            </span>
            <span className="flex items-center">
              <Heart className="h-4 w-4 mr-1 text-red-500" />
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
