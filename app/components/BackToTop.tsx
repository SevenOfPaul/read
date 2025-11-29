import { useState, useCallback, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import { useScroll } from "ahooks";

interface BackToTopProps {
  /** 滚动多少像素后显示按钮，默认一屏高度 */
  showAfter?: number;
  /** 滚动到顶部的持续时间，默认300ms */
  duration?: number;
  /** 自定义类名 */
  className?: string;
}

export default function BackToTop({ 
  showAfter,
  duration = 300,
  className = ""
}: BackToTopProps) {
  const scroll = useScroll();
  const [isVisible, setIsVisible] = useState(false);
  const [windowHeight, setWindowHeight] = useState(800); // 默认值，避免服务端渲染问题

  // 在客户端获取窗口高度
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowHeight(window.innerHeight);
    }
  }, []);

  // 使用传入的showAfter或默认一屏高度
  const triggerHeight = showAfter || windowHeight;
  
  // 判断是否应该显示按钮
  const shouldShow = scroll?.top && scroll.top > triggerHeight;
  
  // 平滑滚动到顶部
  const scrollToTop = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  }, []);

  // 键盘事件处理
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      scrollToTop();
    }
  }, [scrollToTop]);

  return (
    <button
      onClick={scrollToTop}
      onKeyDown={handleKeyDown}
      className={`
        fixed bottom-[15%] right-[5%] z-50 cursor-pointer
        w-12 h-12 md:w-14 md:h-14
        bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700
        text-white rounded-full shadow-lg hover:shadow-xl
        flex items-center justify-center
        transition-all duration-300 ease-in-out
        transform hover:scale-110 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800
        ${shouldShow ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"}
        ${className}
      `}
      aria-label="回到顶部"
      title="回到顶部"
      role="button"
      tabIndex={0}
    >
      <ChevronUp 
        className="w-6 h-6 md:w-7 md:h-7 text-white dark:text-gray-800" 
        aria-hidden="true"
      />
    </button>
  );
}
