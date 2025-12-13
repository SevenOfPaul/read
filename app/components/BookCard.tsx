import { Card, Button } from "react-vant";
import { Link } from "react-router";
import { User, Star } from "lucide-react";
import type { BookInfo } from "@/types/categorySearch";

interface BookCardProps {
  book: BookInfo;
  layout?: 'pc' | 'mobile';
  showRank?: boolean;
  rank?: number;
  className?: string;
  truncateLength?: number;
}

export default function BookCard({ 
  book, 
  layout = 'pc',
  showRank = false,
  rank = 0,
  className = '',
  truncateLength = 100
}: BookCardProps) {
  // 截取描述为指定字数
  const truncateDesc = (desc: string) => {
    if (!desc) return '';
    return desc.length > truncateLength ? desc.substring(0, truncateLength) + '...' : desc;
  };

  if (layout === 'mobile') {
    // 移动端布局 - 垂直紧凑布局
    return (
      <Card className={`bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700
       hover:bg-gray-50 dark:hover:bg-gray-750 transition-all duration-200 hover:shadow-lg ${className}`}>
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
              {showRank && rank < 3 && (
                <div className="absolute -top-1 -left-1">
                  <div className={`${rank === 0 ? 'bg-blue-500' : rank === 1 ? 'bg-indigo-500' : 'bg-purple-500'} text-white px-2 py-1 rounded text-xs font-bold flex items-center`}>
                    {rank === 0 ? '👑' : rank === 1 ? '🥈' : '🥉'} TOP{rank + 1}
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
                  
                  <div className="flex items-center text-sm text-gray-400 dark:text-gray-400 mb-3">
                    <User className="h-4 w-4 mr-1" />
                    <Link to={`/author/${book.authorId}`}><span className="truncate">{book.author}</span></Link>
                  </div>

                  {/* 书籍描述 */}
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                    {truncateDesc(book.desc)}
                  </p>

                  {/* 最新章节 */}
                  {book.lastChapter && (
                    <div className="mb-3 p-2 bg-gray-100 dark:bg-gray-600 rounded text-sm">
                      <div className="text-gray-600 dark:text-gray-300">📖 最新: {book.lastChapter}</div>
                    </div>
                  )}

                  {/* 热度标签 */}
                  {book.fired && (
                    <div className="mb-3">
                      <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                        {book.fired > 10000 ? `${Math.floor(book.fired / 10000)}w` : `${book.fired}`}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* 右侧操作区域 */}
                <div className="flex-shrink-0 ml-3 flex flex-col items-end space-y-2">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-gray-400 dark:text-gray-400">9.2</span>
                  </div>
                  <Link to={`/book/${book.id}`}>
                    <Button 
                      size="small"
                      className="bg-blue-500 hover:bg-blue-600 border-0 text-sm px-3 py-1 font-bold"
                    >
                      📖 阅读
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    );
  }

  // PC端布局 - 左图右文的横向布局
  return (
    <Link to={`/book/${book.id}`} key={book.id}>
      <div className={`relative flex-shrink-0 ${className}`}>
        <Card className="bg-gray-50 w-full h-full p-0 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 hover:shadow-lg">
          <Card.Body className="py-0!">
            {/* 左图右文的Flex布局 */}
            <div className="flex gap-4">
              {/* 左侧封面图片 */}
              <div className="w-32 h-40 flex-shrink-0">
                {book.bookImage && (
                  <img 
                    src={book.bookImage} 
                    alt={book.name}
                    className="w-full h-full object-cover rounded"
                  />
                )}
              </div>

              {/* 右侧信息区域 */}
              <div className="flex-1 space-y-3 p-4 relative">
                {/* 书名 */}
                <h4 className="text-gray-900 dark:text-white font-bold text-lg leading-tight">
                  {book.name}
                </h4>
                <div className="pt-2 absolute top-10 right-2">
                  <span className={`${book.status.includes('连载') ? 'bg-blue-500' : 'bg-gray-500'} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                    {book.status}
                  </span>
                </div>
                {/* 作者信息 */}
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <Link to={`/author/${book.authorId}`}><span className="truncate">{book.author}</span></Link>
                </div>

                {/* 书籍简介 */}
                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 leading-relaxed">
                  {truncateDesc(book.desc)}
                </p>

                {/* 字数和章节信息 */}
                <div className="space-y-1">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    最新章节: {book.lastChapter || '暂无更新'}
                  </div>
                </div>
              </div>
            </div>

          </Card.Body>
        </Card>
      </div>
    </Link>
  );
}
