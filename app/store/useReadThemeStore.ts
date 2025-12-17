import { create } from 'zustand';

interface ReadThemeState {
  // 背景主题：默认背景和字体颜色
  bg: 'default' | 'sepia' | 'dark' | 'green' | 'blue';
  // 字体大小：小、中、大、超大
  font: 'small' | 'medium' | 'large' | 'xlarge';
  
  // 设置背景主题
  setBgTheme: (bg: string) => void;
  // 设置字体大小
  setFont: (font: string) => void;
  // 重置为默认设置
  resetToDefault: () => void;
}

// 创建阅读主题的 zustand store
export const useReadThemeStore = create<ReadThemeState>((set, get) => ({
  bg: 'default',
  font: 'medium',
  
  setBgTheme: (bg: string) => {
    const validBgOptions = ['default', 'sepia', 'dark', 'green', 'blue'];
    const newBg = validBgOptions.includes(bg) ? bg as any : 'default';
    
    const newTheme = { bg: newBg, font: get().font };
    set({ bg: newBg });
    
    // 保存到 localStorage - 使用一个key存储完整主题
    try {
      localStorage.setItem('read-theme', JSON.stringify(newTheme));
    } catch (error) {
      console.warn('无法保存阅读主题偏好到localStorage:', error);
    }
    
    // 同步到CSS
    syncReadThemeToDocument(newTheme.bg, newTheme.font);
  },
  
  setFont: (font: string) => {
    const validFontOptions = ['small', 'medium', 'large', 'xlarge'];
    const newFont = validFontOptions.includes(font) ? font as any : 'medium';
    
    const newTheme = { bg: get().bg, font: newFont };
    set({ font: newFont });
    
    // 保存到 localStorage - 使用一个key存储完整主题
    try {
      localStorage.setItem('read-theme', JSON.stringify(newTheme));
    } catch (error) {
      console.warn('无法保存阅读主题偏好到localStorage:', error);
    }
    
    // 同步到CSS
    syncReadThemeToDocument(newTheme.bg, newTheme.font);
  },
  
  resetToDefault: () => {
    const defaultTheme = { bg: 'default' as const, font: 'medium' as const };
    set(defaultTheme);
    
    // 保存到 localStorage - 使用一个key存储完整主题
    try {
      localStorage.setItem('read-theme', JSON.stringify(defaultTheme));
    } catch (error) {
      console.warn('无法保存阅读主题偏好到localStorage:', error);
    }
    
    // 同步到CSS
    syncReadThemeToDocument(defaultTheme.bg, defaultTheme.font);
  },
}));

// 同步阅读主题到document的class
export const syncReadThemeToDocument = (bg: string, font: string) => {
  const htmlElement = document.documentElement;
  
  // 清除旧的阅读主题类
  const classesToRemove = Array.from(htmlElement.classList).filter(
    className => className.startsWith('read-theme-') || className.startsWith('read-font-')
  );
  classesToRemove.forEach(className => htmlElement.classList.remove(className));
  
  // 添加新的主题类
  htmlElement.classList.add(`read-theme-${bg}`);
  htmlElement.classList.add(`read-font-${font}`);
};

// 获取初始阅读主题偏好
export const getInitialReadTheme = () => {
  let bg: 'default' | 'sepia' | 'dark' | 'green' | 'blue' = 'default';
  let font: 'small' | 'medium' | 'large' | 'xlarge' = 'medium';
  
  try {
    // 读取新的存储格式
    const storedTheme = localStorage.getItem('read-theme');
    if (storedTheme) {
      const theme = JSON.parse(storedTheme);
      if (theme.bg && ['default', 'sepia', 'dark', 'green', 'blue'].includes(theme.bg)) {
        bg = theme.bg;
      }
      if (theme.font && ['small', 'medium', 'large', 'xlarge'].includes(theme.font)) {
        font = theme.font;
      }
    }
  } catch (error) {
    console.warn('无法读取阅读主题偏好:', error);
  }
  
  return { bg, font };
};

// 初始化阅读主题
export const initializeReadTheme = () => {
  const { bg, font } = getInitialReadTheme();
  
  // 设置初始状态
  useReadThemeStore.setState({ bg, font });
  
  // 同步到document
  syncReadThemeToDocument(bg, font);
};

// 获取背景主题对应的Tailwind类名
export const getBgThemeClasses = (bg: string, isDark: boolean = false) => {
  const themeMap: Record<string, { light: string; dark: string }> = {
    default: {
      light: 'bg-white',
      dark: 'bg-gray-900'
    },
    sepia: {
      light: 'bg-amber-50',
      dark: 'bg-amber-900'
    },
    dark: {
      light: 'bg-gray-800 text-gray-100',
      dark: 'bg-gray-900 text-gray-100'
    },
    green: {
      light: 'bg-green-50',
      dark: 'bg-green-900'
    },
    blue: {
      light: 'bg-blue-50',
      dark: 'bg-blue-900'
    }
  };
  
  const theme = themeMap[bg] || themeMap.default;
  return isDark ? theme.dark : theme.light;
};

// 获取字体大小对应的Tailwind类名
export const getFontSizeClasses = (font: string) => {
  const fontMap: Record<string, string> = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
    xlarge: 'text-xl'
  };
  
  return fontMap[font] || fontMap.medium;
};

// 获取行高对应的Tailwind类名
export const getLineHeightClasses = (font: string) => {
  const lineHeightMap: Record<string, string> = {
    small: 'leading-relaxed',
    medium: 'leading-relaxed',
    large: 'leading-loose',
    xlarge: 'leading-loose'
  };
  
  return lineHeightMap[font] || lineHeightMap.medium;
};
