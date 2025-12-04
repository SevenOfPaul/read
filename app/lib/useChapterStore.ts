import { create } from 'zustand';

interface ChapterState {
  // 核心状态 - 只保存ID
  currentChapterId: string | null;
  bookId: string | null;
  
  // 操作方法
  setCurrentChapter: (chapterId: string, bookId: string) => void;
  clearChapter: () => void;
  
  // 阅读进度持久化
  saveReadingProgress: () => void;
  loadReadingProgress: (bookId: string) => string | null;
  getReadingProgress: (bookId: string) => string | null;
}

// 获取初始状态
const getInitialState = () => {
  if (typeof window === 'undefined') {
    return {
      currentChapterId: null,
      bookId: null,
    };
  }
  
  try {
    // 可选：从 URL 参数恢复状态
    const urlParams = new URLSearchParams(window.location.search);
    const savedChapterId = urlParams.get('chapter');
    const savedBookId = urlParams.get('book');
    
    return {
      currentChapterId: savedChapterId,
      bookId: savedBookId,
    };
  } catch (error) {
    console.warn('无法从 URL 参数恢复状态:', error);
    return {
      currentChapterId: null,
      bookId: null,
    };
  }
};

export const useChapterStore = create<ChapterState>((set, get) => ({
  // 初始状态
  ...getInitialState(),
  
  setCurrentChapter: (chapterId: string, bookId: string) => {
    set({ currentChapterId: chapterId, bookId });
    // 自动保存阅读进度
    get().saveReadingProgress();
  },
  
  clearChapter: () => {
    set({ currentChapterId: null, bookId: null });
  },
  
  saveReadingProgress: () => {
    const { currentChapterId, bookId } = get();
    if (currentChapterId && bookId) {
      try {
        localStorage.setItem(`reading-progress-${bookId}`, currentChapterId);
        console.log(`阅读进度已保存: 书籍${bookId}, 章节${currentChapterId}`);
      } catch (error) {
        console.warn('保存阅读进度失败:', error);
      }
    }
  },
  
  loadReadingProgress: (bookId: string) => {
    try {
      return localStorage.getItem(`reading-progress-${bookId}`);
    } catch (error) {
      console.warn('读取阅读进度失败:', error);
      return null;
    }
  },
  
  getReadingProgress: (bookId: string) => {
    return get().loadReadingProgress(bookId);
  }
}));
