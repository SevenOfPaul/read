import { create } from 'zustand';

interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

// 创建基础的 zustand store
export const useThemeStore = create<ThemeState>((set, get) => ({
  isDark: false, // 初始值，后续会在组件中同步
  toggleTheme: () => {
    const currentTheme = get().isDark;
    const newTheme = !currentTheme;
    
    // 更新状态
    set({ isDark: newTheme });
    
    // 保存到 localStorage
    try {
      localStorage.setItem('theme-preference', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.warn('无法保存主题偏好到localStorage:', error);
    }
    
    // 同步到document
    syncThemeToDocument(newTheme);
  },
  setTheme: (isDark: boolean) => {
    set({ isDark });
    
    // 保存到 localStorage
    try {
      localStorage.setItem('theme-preference', isDark ? 'dark' : 'light');
    } catch (error) {
      console.warn('无法保存主题偏好到localStorage:', error);
    }
    
    // 同步到document
    syncThemeToDocument(isDark);
  },
}));

// 同步主题到document的class
export const syncThemeToDocument = (isDark: boolean) => {
  const htmlElement = document.documentElement;
  
  if (isDark) {
    htmlElement.classList.add('dark');
  } else {
    htmlElement.classList.remove('dark');
  }
};

// 获取初始主题偏好
export const getInitialTheme = (): boolean => {
  try {
    const storedTheme = localStorage.getItem('theme-preference');
    
    if (storedTheme === 'dark') return true;
    if (storedTheme === 'light') return false;
    
    // 如果没有存储的偏好，使用系统偏好
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
  } catch (error) {
    console.warn('无法读取主题偏好:', error);
  }
  
  return false;
};

// 检测系统主题变化的监听器
export const setupSystemThemeListener = () => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handleChange = (e: MediaQueryListEvent) => {
    const storedTheme = localStorage.getItem('theme-preference');
    
    // 只有在用户没有手动设置主题时才跟随系统主题
    if (storedTheme === 'auto' || storedTheme === null) {
      // 自动跟随系统主题
      const newTheme = e.matches;
      useThemeStore.getState().setTheme(newTheme);
    }
  };
  
  mediaQuery.addListener(handleChange);
  
  return () => {
    mediaQuery.removeListener(handleChange);
  };
};
