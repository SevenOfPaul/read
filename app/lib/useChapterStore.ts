import { create } from 'zustand';

interface ChapterState {
  // 核心状态 - 只保存ID
  currentChapterId: string | null;
  bookId: string | null;
  
  // 操作方法
  setCurrentChapter: (chapterId: string, bookId: string) => void;
  clearChapter: () => void;
}

// 初始状态类型
interface ReadingProgress {
  bookId: string | null;
  currentChapterId: string | null;
}

// 获取初始状态
const getInitialState = (): ReadingProgress => {
  try {
    // 从 localStorage 读取阅读进度
    const savedProgress = localStorage.getItem('reading');
    
    if (savedProgress) {
      return JSON.parse(savedProgress);
    }
    
    return {
      bookId: null,
      currentChapterId: null
    };
  } catch (error) {
    console.warn('读取阅读进度失败:', error);
    return {
      bookId: null,
      currentChapterId: null
    };
  }
};

export const useChapterStore = create<ChapterState>((set, get) => {
  const initialState = getInitialState();
  
  return {
    // 初始状态从 localStorage 获取
    currentChapterId: initialState.currentChapterId,
    bookId: initialState.bookId,
    
    setCurrentChapter: (chapterId: string, bookId: string) => {
      set({ currentChapterId: chapterId, bookId });
      
      // 手动保存到 localStorage
      try {
        const progress = { bookId, currentChapterId: chapterId };
        localStorage.setItem('reading', JSON.stringify(progress));
      } catch (error) {
        console.warn('保存阅读进度失败:', error);
      }
    },
    
    clearChapter: () => {
      set({ currentChapterId: null, bookId: null });
      
      // 清除 localStorage 中的阅读进度
      try {
        localStorage.removeItem('reading');
      } catch (error) {
        console.warn('清除阅读进度失败:', error);
      }
    }
  };
});
