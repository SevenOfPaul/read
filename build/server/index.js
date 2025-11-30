import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { renderToString } from 'react-dom/server';
import { ServerRouter, UNSAFE_withComponentProps, Outlet, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse, Meta, Links, ScrollRestoration, Scripts, useLocation, Link, useParams, useNavigate } from 'react-router';
import { QueryClient, QueryClientProvider, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { create } from 'zustand';
import { ChevronUp, BookOpen, Sun, Moon, Search, Filter, Crown, Award, TrendingUp, Heart, User, Menu, X, Star, Clock, ArrowLeft, Share, MoreHorizontal, ChevronLeft, ChevronRight, Home } from 'lucide-react';
import { useScroll } from 'ahooks';
import { Card, Button, Pagination } from 'react-vant';

function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  const html = renderToString(
    /* @__PURE__ */ jsx(ServerRouter, { context: remixContext, url: request.url })
  );
  return new Response(html, {
    status: responseStatusCode,
    headers: {
      ...responseHeaders,
      "Content-Type": "text/html"
    }
  });
}

const entryServer = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: 'Module' }));

const useThemeStore = create((set, get) => ({
  isDark: false,
  // 初始值，后续会在组件中同步
  toggleTheme: () => {
    const currentTheme = get().isDark;
    const newTheme = !currentTheme;
    set({ isDark: newTheme });
    try {
      localStorage.setItem("theme-preference", newTheme ? "dark" : "light");
    } catch (error) {
      console.warn("无法保存主题偏好到localStorage:", error);
    }
    syncThemeToDocument(newTheme);
  },
  setTheme: (isDark) => {
    set({ isDark });
    try {
      localStorage.setItem("theme-preference", isDark ? "dark" : "light");
    } catch (error) {
      console.warn("无法保存主题偏好到localStorage:", error);
    }
    syncThemeToDocument(isDark);
  }
}));
const syncThemeToDocument = (isDark) => {
  const htmlElement = document.documentElement;
  if (isDark) {
    htmlElement.classList.add("dark");
  } else {
    htmlElement.classList.remove("dark");
  }
};
const getInitialTheme = () => {
  try {
    const storedTheme = localStorage.getItem("theme-preference");
    if (storedTheme === "dark") return true;
    if (storedTheme === "light") return false;
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
  } catch (error) {
    console.warn("无法读取主题偏好:", error);
  }
  return false;
};
const setupSystemThemeListener = () => {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const handleChange = (e) => {
    const storedTheme = localStorage.getItem("theme-preference");
    if (storedTheme === "auto" || storedTheme === null) {
      const newTheme = e.matches;
      useThemeStore.getState().setTheme(newTheme);
    }
  };
  mediaQuery.addListener(handleChange);
  return () => {
    mediaQuery.removeListener(handleChange);
  };
};

function BackToTop({
  showAfter,
  duration = 300,
  className = ""
}) {
  const scroll = useScroll();
  const [isVisible, setIsVisible] = useState(false);
  const [windowHeight, setWindowHeight] = useState(800);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowHeight(window.innerHeight);
    }
  }, []);
  const triggerHeight = showAfter || windowHeight;
  const shouldShow = scroll?.top && scroll.top > triggerHeight;
  const scrollToTop = useCallback(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  }, []);
  const handleKeyDown = useCallback((event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      scrollToTop();
    }
  }, [scrollToTop]);
  return /* @__PURE__ */ jsx(
    "button",
    {
      onClick: scrollToTop,
      onKeyDown: handleKeyDown,
      className: `
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
      `,
      "aria-label": "回到顶部",
      title: "回到顶部",
      role: "button",
      tabIndex: 0,
      children: /* @__PURE__ */ jsx(
        ChevronUp,
        {
          className: "w-6 h-6 md:w-7 md:h-7 text-white dark:text-gray-800",
          "aria-hidden": "true"
        }
      )
    }
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1e3 * 60 * 5,
      // 5分钟
      gcTime: 1e3 * 60 * 10,
      // 10分钟
      retry: 3,
      refetchOnWindowFocus: false,
      retryDelay: (attemptIndex) => Math.min(1e3 * 2 ** attemptIndex, 3e4)
    },
    mutations: {
      retry: 1
    }
  }
});
const links = () => [{
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
}];
function ThemeProvider({
  children
}) {
  const {
    isDark
  } = useThemeStore();
  useEffect(() => {
    syncThemeToDocument(isDark);
    const cleanup = setupSystemThemeListener();
    return cleanup;
  }, [isDark]);
  return /* @__PURE__ */ jsx(Fragment, {
    children
  });
}
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "zh-CN",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsx("body", {
      children: /* @__PURE__ */ jsxs(QueryClientProvider, {
        client: queryClient,
        children: [/* @__PURE__ */ jsxs(ThemeProvider, {
          children: [children, /* @__PURE__ */ jsx(BackToTop, {})]
        }), /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
      })
    })]
  });
}
const root = UNSAFE_withComponentProps(function App() {
  const {
    setTheme
  } = useThemeStore();
  useEffect(() => {
    const initialTheme = getInitialTheme();
    setTheme(initialTheme);
  }, [setTheme]);
  return /* @__PURE__ */ jsx(Outlet, {});
});
const ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "出错了！";
  let details = "发生了一个意外错误。";
  let stack;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "错误";
    details = error.status === 404 ? "请求的页面未找到。" : error.statusText || details;
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "pt-16 p-4 container mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      children: message
    }), /* @__PURE__ */ jsx("p", {
      children: details
    }), stack]
  });
});

const route0 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: root,
  links
}, Symbol.toStringTag, { value: 'Module' }));

function handleSearch() {
  console.log("搜索功能开发中...");
}
const getActiveMenuItem = (pathname) => {
  if (pathname === "/all" || pathname.startsWith("/home")) return "all";
  if (pathname.startsWith("/book")) return "books";
  if (pathname.startsWith("/category")) return "category";
  if (pathname.includes("rank") || pathname.includes("ranking")) return "rank";
  if (pathname.includes("complete") || pathname.includes("finished") || pathname.includes("/special/completed")) return "complete";
  if (pathname.includes("new") || pathname.includes("latest") || pathname.includes("/special/new")) return "new";
  return "home";
};
const menuItems = [
  { key: "/all", label: "全部作品", href: "/all", isLink: false },
  { key: "rank", label: "排行榜", href: "/rank", isLink: false },
  { key: "complete", label: "完结", href: "/special/completed", isLink: true },
  { key: "new", label: "新书", href: "/special/new", isLink: true },
  { key: "category", label: "分类", href: "/category/''", isLink: true }
];
function Navbar({
  title = "夜读小说网",
  subtitle = "精品小说 · 夜夜精彩",
  showSearch = true
}) {
  const { isDark, toggleTheme } = useThemeStore();
  const location = useLocation();
  const activeMenuItem = getActiveMenuItem(location.pathname);
  return /* @__PURE__ */ jsxs("nav", { className: "bg-white dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200 sticky top-0 z-50 transition-colors duration-300", children: [
    /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-8", children: [
        /* @__PURE__ */ jsx(Link, { to: "/", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
          /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx(BookOpen, { className: "h-6 w-6 text-white" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold text-gray-900 dark:text-white", children: title }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 dark:text-gray-400", children: subtitle })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "hidden md:flex items-center space-x-6", children: menuItems.map((item) => {
          const isActive = activeMenuItem === item.key;
          const linkClassName = `
                  px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                  ${isActive ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-b-2 border-blue-600 dark:border-blue-400" : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"}
                `;
          if (item.isLink) {
            return /* @__PURE__ */ jsx(
              Link,
              {
                to: item.href,
                className: linkClassName,
                children: item.label
              },
              item.key
            );
          } else {
            return /* @__PURE__ */ jsx(
              "a",
              {
                href: "#",
                className: linkClassName,
                onClick: (e) => {
                  e.preventDefault();
                  console.log(`${item.label}功能开发中...`);
                },
                children: item.label
              },
              item.key
            );
          }
        }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "p-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200",
            onClick: toggleTheme,
            title: isDark ? "切换到白天模式" : "切换到黑夜模式",
            children: isDark ? /* @__PURE__ */ jsx(Sun, { className: "h-5 w-5 dark:text-gray-300 text-gray-600" }) : /* @__PURE__ */ jsx(Moon, { className: "h-5 w-5" })
          }
        ),
        showSearch && /* @__PURE__ */ jsx(
          "button",
          {
            className: "p-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200",
            onClick: handleSearch,
            title: "搜索",
            children: /* @__PURE__ */ jsx(Search, { className: "h-5 w-5 dark:text-gray-300 text-gray-600" })
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "md:hidden border-t dark:border-gray-700 border-gray-200 bg-white dark:bg-gray-800", children: /* @__PURE__ */ jsx("div", { className: "px-4 py-2", children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between space-x-1 overflow-x-auto", children: menuItems.map((item) => {
      const isActive = activeMenuItem === item.key;
      const linkClassName = `
                px-3 py-2 rounded-md text-xs font-medium whitespace-nowrap transition-all duration-200
                ${isActive ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20" : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"}
              `;
      if (item.isLink) {
        return /* @__PURE__ */ jsx(
          Link,
          {
            to: item.href,
            className: linkClassName,
            children: item.label
          },
          item.key
        );
      } else {
        return /* @__PURE__ */ jsx(
          "a",
          {
            href: "#",
            className: linkClassName,
            onClick: (e) => {
              e.preventDefault();
              console.log(`${item.label}功能开发中...`);
            },
            children: item.label
          },
          item.key
        );
      }
    }) }) }) })
  ] });
}

function PC$4() {
  const { data: categories, isLoading, error } = useCategories$1();
  const { data: hotBooks } = useHotBooks();
  const truncateDesc = (desc) => {
    if (!desc) return "";
    return desc.length > 100 ? desc.substring(0, 100) + "..." : desc;
  };
  const totalBooks = categories?.reduce((sum, cat) => sum + (cat.books?.length || 0), 0) || 0;
  const categoriesWithBooks = categories?.filter((cat) => cat.books && cat.books.length > 0) || [];
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto pt-6 py-6", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-6", children: [
      /* @__PURE__ */ jsx("aside", { className: "w-64 flex-shrink-0", children: /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 transition-colors duration-300", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-gray-900 dark:text-white font-bold text-lg", children: "作品分类" }),
          /* @__PURE__ */ jsx(Filter, { className: "h-4 w-4 text-gray-400 dark:text-gray-400" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-1", children: categories && categories.map((category) => /* @__PURE__ */ jsx(
          Link,
          {
            to: `/category/${category.id}`,
            className: "block px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-white hover:bg-gray-700 dark:hover:bg-gray-700 rounded transition-colors",
            children: category.name
          },
          category.id
        )) }),
        /* @__PURE__ */ jsxs("div", { className: "mt-6 pt-4 border-t border-gray-700", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-gray-900 dark:text-white font-medium mb-3", children: "快捷功能" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("a", { href: "#", className: "block text-gray-400 dark:text-gray-400 hover:text-black text-sm", children: "我的书架" }),
            /* @__PURE__ */ jsx("a", { href: "#", className: "block text-gray-400 dark:text-gray-400 hover:text-black text-sm", children: "阅读历史" }),
            /* @__PURE__ */ jsx("a", { href: "#", className: "block text-gray-400 dark:text-gray-400 hover:text-black text-sm", children: "收藏夹" })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("main", { className: "flex-1", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-8 mb-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold text-gray-900 dark:text-white mb-2", children: "📚 精品小说汇聚地" }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-600 dark:text-gray-300 text-lg", children: "每晚22:00准时更新 · 千万书友共同选择" }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center space-x-6 text-sm text-gray-400 dark:text-gray-400", children: [
              /* @__PURE__ */ jsxs("span", { children: [
                "📊 总藏书: ",
                /* @__PURE__ */ jsx("span", { className: "text-gray-900 dark:text-white font-bold", children: totalBooks }),
                " 本"
              ] }),
              /* @__PURE__ */ jsxs("span", { children: [
                "📂 分类: ",
                /* @__PURE__ */ jsx("span", { className: "text-gray-900 dark:text-white font-bold", children: categoriesWithBooks.length }),
                " 个"
              ] }),
              /* @__PURE__ */ jsxs("span", { children: [
                "⏰ 在线: ",
                /* @__PURE__ */ jsx("span", { className: "text-gray-900 dark:text-white font-bold", children: "24H" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "text-right", children: /* @__PURE__ */ jsx("div", { className: "bg-blue-500 text-white px-6 py-3 rounded-lg font-bold text-lg hover:bg-blue-600 cursor-pointer transition-colors", children: "🔥 立即探索" }) })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-gray-900 dark:text-white font-bold text-xl", children: "✨ 编辑推荐" }),
            /* @__PURE__ */ jsx("a", { href: "#", className: "text-blue-400 hover:text-blue-300 text-sm font-medium", children: "查看更多 →" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "space-y-4", children: categories && categories.slice(0, 2).map((category) => {
            if (!category.books || category.books.length === 0) return null;
            const featuredBook = category.books[0];
            return /* @__PURE__ */ jsx(Card, { className: "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors", children: /* @__PURE__ */ jsx(Card.Body, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex space-x-4", children: [
              featuredBook.bookImage && /* @__PURE__ */ jsx(
                "img",
                {
                  src: featuredBook.bookImage,
                  alt: featuredBook.name,
                  className: "w-20 h-28 object-cover rounded flex-shrink-0",
                  onError: (e) => {
                    const target = e.target;
                    target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDIwMCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NiA2NEw5MCA3Nkw5NCA2NEgxMTBMMTMyIDEyOEwxMDggMTQ0SDkwSDEwOEw5NCAxMTZMMTAwIDEwOEw5NiA5Nkg4NlpNMTI0IDExMkwxMjggMTIwUTEyNiAxMzAgMTIyIDEzMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+";
                  }
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsx("h4", { className: "text-gray-900 dark:text-white font-bold text-lg mb-1 line-clamp-2", children: featuredBook.name }),
                    /* @__PURE__ */ jsx(Link, { to: `/author/${featuredBook.authorId}`, children: /* @__PURE__ */ jsxs("p", { className: "text-gray-400 dark:text-gray-400 text-sm mb-2", children: [
                      "👤 ",
                      featuredBook.author
                    ] }) }),
                    /* @__PURE__ */ jsx("p", { className: "text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2", children: truncateDesc(featuredBook.desc) })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex-shrink-0 ml-4", children: [
                    /* @__PURE__ */ jsxs("span", { className: "text-blue-400 text-xs font-medium block mb-2", children: [
                      "🔥 ",
                      featuredBook.status
                    ] }),
                    /* @__PURE__ */ jsx(Link, { to: `/book/${featuredBook.id}`, children: /* @__PURE__ */ jsx(Button, { size: "small", className: "bg-blue-500 hover:bg-blue-600 border-0 text-xs px-3", children: "立即阅读" }) })
                  ] })
                ] }),
                featuredBook.lastChapter && /* @__PURE__ */ jsx("div", { className: "mt-2 p-2 bg-gray-100 dark:bg-gray-600 rounded text-xs", children: /* @__PURE__ */ jsxs("div", { className: "text-gray-600 dark:text-gray-300", children: [
                  "📖 最新: ",
                  featuredBook.lastChapter
                ] }) })
              ] })
            ] }) }) }, featuredBook.id);
          }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("aside", { className: "w-80 flex-shrink-0", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300", children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-gray-900 dark:text-white font-bold text-lg mb-4 flex items-center", children: [
            /* @__PURE__ */ jsx(Crown, { className: "h-5 w-5 mr-2 text-yellow-500" }),
            "🔥 畅销榜"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "space-y-3", children: hotBooks && hotBooks.map((book, index) => {
            const rank = index + 1;
            return /* @__PURE__ */ jsx(Link, { to: `/book/${book.id}`, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded cursor-pointer transition-colors", children: [
              /* @__PURE__ */ jsx("div", { className: `w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${rank === 1 ? "bg-blue-500 text-white" : rank === 2 ? "bg-indigo-500 text-white" : rank === 3 ? "bg-purple-500 text-white" : "bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300"}`, children: rank }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsx("div", { className: "text-gray-900 dark:text-white text-sm font-medium line-clamp-1", children: book.name }),
                /* @__PURE__ */ jsxs(Link, { to: `/author/${book.authorId}`, children: [
                  " ",
                  /* @__PURE__ */ jsxs("div", { className: "text-gray-400 dark:text-gray-400 text-xs", children: [
                    "👤 ",
                    book.author
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "text-blue-400 text-xs", children: formatHeat$3(book.fired) })
            ] }) }, book.id);
          }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 transition-colors duration-300", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-gray-900 dark:text-white font-bold text-lg mb-4", children: "⚡ 快捷操作" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Button, { block: true, className: "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white", children: "📚 我的书架" }),
            /* @__PURE__ */ jsx(Button, { block: true, className: "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white", children: "🔖 收藏夹" }),
            /* @__PURE__ */ jsx(Button, { block: true, className: "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white", children: "📊 阅读统计" })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-6 mb-6", children: /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-6 shadow-lg", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold text-white mb-2", children: "🎯 精品分类推荐" }),
      /* @__PURE__ */ jsx("p", { className: "text-blue-100 text-lg", children: "精心挑选各类优质小说，满足您的阅读需求" }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 flex justify-center items-center space-x-6 text-sm text-blue-100", children: [
        /* @__PURE__ */ jsxs("span", { className: "flex items-center", children: [
          /* @__PURE__ */ jsx(Award, { className: "h-4 w-4 mr-1" }),
          "品质保证"
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "flex items-center", children: [
          /* @__PURE__ */ jsx(TrendingUp, { className: "h-4 w-4 mr-1" }),
          "热门推荐"
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "flex items-center", children: [
          /* @__PURE__ */ jsx(Heart, { className: "h-4 w-4 mr-1" }),
          "精品内容"
        ] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx("div", { className: "w-full", children: /* @__PURE__ */ jsx("div", { className: "space-y-6 flex flex-row flex-wrap gap-4 px-6", children: categories && categories.map((category) => {
      const hasBooks = category.books && category.books.length > 0;
      return /* @__PURE__ */ jsxs("div", { className: "bg-white \r\n                 dark:bg-gray-800 w-162 rounded-lg overflow-hidden border border-gray-200 \r\n                 dark:border-gray-700 transition-colors duration-300", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-gray-100 dark:bg-gray-700 p-4 border-l-4 border-blue-500", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("h3", { className: "text-gray-900 dark:text-white font-bold text-xl mb-1", children: [
              "📚 ",
              category.name
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-400 dark:text-gray-400 text-sm", children: hasBooks ? /* @__PURE__ */ jsxs(Fragment, { children: [
              "💎 ",
              category.books.length,
              "本精品 · 🔥火热更新 · ⭐品质保证"
            ] }) : "🎯 敬请期待更多精彩内容" })
          ] }),
          hasBooks && /* @__PURE__ */ jsxs("div", { className: "flex space-x-2", children: [
            /* @__PURE__ */ jsx("span", { className: "bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold", children: "🔥 热门" }),
            /* @__PURE__ */ jsx("span", { className: "bg-indigo-500 text-white px-3 py-1 rounded-full text-xs font-bold", children: "✨ 新书" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "p-4", children: hasBooks ? /* @__PURE__ */ jsx("div", { className: "space-y-4", children: category.books.map((book, index) => /* @__PURE__ */ jsx(Card, { className: "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 hover:shadow-lg", children: /* @__PURE__ */ jsx(Card.Body, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex space-x-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative flex-shrink-0", children: [
            book.bookImage && /* @__PURE__ */ jsx(
              "img",
              {
                src: book.bookImage,
                alt: book.name,
                className: "w-20 h-28 object-cover rounded",
                onError: (e) => {
                  const target = e.target;
                  target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDIwMCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NiA2NEw5MCA3Nkw5NCA2NEgxMTBMMTMyIDEyOEwxMDggMTQ0SDkwSDEwOEw5NCAxMTZMMTAwIDEwOEw5NiA5Nkg4NlpNMTI0IDExMkwxMjggMTIwUTEyNiAxMzAgMTIyIDEzMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+";
                }
              }
            ),
            index < 3 && /* @__PURE__ */ jsx("div", { className: "absolute -top-1 -left-1", children: /* @__PURE__ */ jsxs("div", { className: `${index === 0 ? "bg-blue-500" : index === 1 ? "bg-indigo-500" : "bg-purple-500"} text-white px-2 py-1 rounded text-xs font-bold flex items-center`, children: [
              index === 0 ? "👑" : index === 1 ? "🥈" : "🥉",
              " TOP",
              index + 1
            ] }) }),
            /* @__PURE__ */ jsx("div", { className: "absolute -bottom-1 -right-1", children: /* @__PURE__ */ jsx("span", { className: `${book.status.includes("连载") ? "bg-green-500" : "bg-blue-500"} text-white px-2 py-1 rounded text-xs font-bold`, children: book.status }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsx("h4", { className: "text-gray-900 dark:text-white font-bold text-lg mb-2 line-clamp-2 leading-tight", children: book.name }),
              /* @__PURE__ */ jsx(Link, { to: `/author/${book.authorId}`, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center text-sm text-gray-400 dark:text-gray-400 mb-3", children: [
                /* @__PURE__ */ jsx(User, { className: "h-4 w-4 mr-1" }),
                /* @__PURE__ */ jsx("span", { className: "truncate", children: book.author })
              ] }) }),
              /* @__PURE__ */ jsx("p", { className: "text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2", children: truncateDesc(book.desc) }),
              book.lastChapter && /* @__PURE__ */ jsx("div", { className: "mb-3 p-2 bg-gray-100 dark:bg-gray-600 rounded text-sm", children: /* @__PURE__ */ jsxs("div", { className: "text-gray-600 dark:text-gray-300", children: [
                "📖 最新: ",
                book.lastChapter
              ] }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex-shrink-0 ml-4 flex flex-col items-end space-y-2", children: [
              /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-1", children: /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-400 dark:text-gray-400", children: formatHeat$3(book.fired) }) }),
              /* @__PURE__ */ jsx(Link, { to: `/book/${book.id}`, children: /* @__PURE__ */ jsx(
                Button,
                {
                  size: "small",
                  className: "bg-blue-500 hover:bg-blue-600 border-0 text-sm px-4 py-2 font-bold",
                  children: "📖 阅读"
                }
              ) })
            ] })
          ] }) })
        ] }) }) }, book.id)) }) : (
          /* 空分类状态 */
          /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
            /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx(BookOpen, { className: "h-8 w-8 text-gray-400 dark:text-gray-400" }) }),
            /* @__PURE__ */ jsx("h4", { className: "text-gray-400 dark:text-gray-400 font-medium mb-2", children: "精彩即将呈现" }),
            /* @__PURE__ */ jsxs("p", { className: "text-gray-500 dark:text-gray-500 text-sm", children: [
              "我们正在精心策划优质的",
              category.name,
              "小说内容，敬请期待！"
            ] })
          ] })
        ) })
      ] }, category.id);
    }) }) }),
    isLoading && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-8 text-center shadow-2xl transition-colors duration-300", children: [
      /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4" }),
      /* @__PURE__ */ jsx("div", { className: "text-gray-900 dark:text-white text-lg font-bold", children: "正在加载精彩小说..." }),
      /* @__PURE__ */ jsx("div", { className: "text-gray-400 dark:text-gray-400 text-sm", children: "请稍候，好书即将呈现" })
    ] }) }),
    error && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-8 text-center shadow-2xl max-w-md transition-colors duration-300", children: [
      /* @__PURE__ */ jsx("div", { className: "text-6xl mb-4", children: "😵" }),
      /* @__PURE__ */ jsx("h3", { className: "text-gray-900 dark:text-white text-xl font-bold mb-4", children: "加载失败" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-400 dark:text-gray-400 mb-6", children: error instanceof Error ? error.message : "网络连接出现问题" }),
      /* @__PURE__ */ jsx(
        Button,
        {
          onClick: () => window.location.reload(),
          className: "bg-blue-500 hover:bg-blue-600 border-0",
          children: "🔄 重新加载"
        }
      )
    ] }) })
  ] });
}

function Mobile$4() {
  const { data: categories, isLoading, error } = useCategories$1();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const truncateDesc = (desc) => {
    if (!desc) return "";
    return desc.length > 100 ? desc.substring(0, 100) + "..." : desc;
  };
  const totalBooks = categories?.reduce((sum, cat) => sum + (cat.books?.length || 0), 0) || 0;
  const categoriesWithBooks = categories?.filter((cat) => cat.books && cat.books.length > 0) || [];
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300", children: [
    /* @__PURE__ */ jsx("nav", { className: "bg-white dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200 sticky top-0 z-50 transition-colors duration-300", children: /* @__PURE__ */ jsx("div", { className: "px-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-3", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsx("div", { className: "w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx(BookOpen, { className: "h-5 w-5 text-white" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-lg font-bold text-gray-900 dark:text-white", children: "夜读小说网" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 dark:text-gray-400", children: "精品小说 · 夜夜精彩" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "p-2 text-gray-600 dark:text-gray-400 hover:text-white hover:bg-gray-700 dark:hover:bg-gray-700 rounded-lg transition-colors",
            onClick: () => setIsSidebarOpen(true),
            children: /* @__PURE__ */ jsx(Menu, { className: "h-5 w-5" })
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "p-2 text-gray-600 dark:text-gray-400 hover:text-white hover:bg-gray-700 dark:hover:bg-gray-700 rounded-lg transition-colors",
            children: /* @__PURE__ */ jsx(Search, { className: "h-5 w-5" })
          }
        )
      ] })
    ] }) }) }),
    isSidebarOpen && /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-50 lg:hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/50", onClick: () => setIsSidebarOpen(false) }),
      /* @__PURE__ */ jsx("aside", { className: "fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700", children: /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-gray-900 dark:text-white font-bold text-lg", children: "作品分类" }),
          /* @__PURE__ */ jsx("button", { onClick: () => setIsSidebarOpen(false), children: /* @__PURE__ */ jsx(X, { className: "h-5 w-5 text-gray-400" }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-1 mb-6", children: categories && categories.map((category) => /* @__PURE__ */ jsx(
          "a",
          {
            href: "#",
            className: "block px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-white hover:bg-gray-700 dark:hover:bg-gray-700 rounded transition-colors",
            children: category.name
          },
          category.id
        )) }),
        /* @__PURE__ */ jsxs("div", { className: "pt-4 border-t border-gray-200 dark:border-gray-700", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-gray-900 dark:text-white font-medium mb-3", children: "快捷功能" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("a", { href: "#", className: "block text-gray-400 dark:text-gray-400 hover:text-white text-sm", children: "我的书架" }),
            /* @__PURE__ */ jsx("a", { href: "#", className: "block text-gray-400 dark:text-gray-400 hover:text-white text-sm", children: "阅读历史" }),
            /* @__PURE__ */ jsx("a", { href: "#", className: "block text-gray-400 dark:text-gray-400 hover:text-white text-sm", children: "收藏夹" })
          ] })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "px-4 py-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-900 dark:text-white mb-2", children: "📚 精品小说汇聚地" }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-600 dark:text-gray-300 text-sm mb-4", children: "每晚22:00准时更新 · 千万书友共同选择" }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4 text-xs text-gray-400 dark:text-gray-400", children: [
              /* @__PURE__ */ jsxs("span", { children: [
                "📊 总藏书: ",
                /* @__PURE__ */ jsx("span", { className: "text-gray-900 dark:text-white font-bold", children: totalBooks }),
                " 本"
              ] }),
              /* @__PURE__ */ jsxs("span", { children: [
                "📂 分类: ",
                /* @__PURE__ */ jsx("span", { className: "text-gray-900 dark:text-white font-bold", children: categoriesWithBooks.length }),
                " 个"
              ] }),
              /* @__PURE__ */ jsxs("span", { children: [
                "⏰ 在线: ",
                /* @__PURE__ */ jsx("span", { className: "text-gray-900 dark:text-white font-bold", children: "24H" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "text-right", children: /* @__PURE__ */ jsx("div", { className: "bg-blue-500 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-600 cursor-pointer transition-colors", children: "🔥 立即探索" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              block: true,
              type: "primary",
              icon: /* @__PURE__ */ jsx(Search, { className: "h-4 w-4" }),
              className: "bg-blue-500 hover:bg-blue-600 border-0 h-10 text-white text-sm",
              children: "🔍 搜索小说"
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              block: true,
              type: "default",
              className: "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white h-10 text-sm",
              children: "📝 查看书架"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-gray-900 dark:text-white font-bold text-xl", children: "✨ 编辑推荐" }),
          /* @__PURE__ */ jsx("a", { href: "#", className: "text-blue-400 hover:text-blue-300 text-sm font-medium", children: "查看更多 →" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-4", children: categories && categories.slice(0, 2).map((category) => {
          if (!category.books || category.books.length === 0) return null;
          const featuredBook = category.books[0];
          return /* @__PURE__ */ jsx(Card, { className: "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors", children: /* @__PURE__ */ jsx(Card.Body, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex space-x-3", children: [
            featuredBook.bookImage && /* @__PURE__ */ jsx(
              "img",
              {
                src: featuredBook.bookImage,
                alt: featuredBook.name,
                className: "w-16 h-20 object-cover rounded flex-shrink-0",
                onError: (e) => {
                  const target = e.target;
                  target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDIwMCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NiA2NEw5MCA3Nkw5NCA2NEgxMTBMMTMyIDEyOEwxMDggMTQ0SDkwSDEwOEw5NCAxMTZMMTAwIDEwOEw5NiA5Nkg4NlpNMTI0IDExMkwxMjggMTIwUTEyNiAxMzAgMTIyIDEzMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+";
                }
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsx("h4", { className: "text-gray-900 dark:text-white font-bold text-base mb-1 line-clamp-2", children: featuredBook.name }),
                  /* @__PURE__ */ jsxs("p", { className: "text-gray-400 dark:text-gray-400 text-sm mb-2", children: [
                    "👤 ",
                    featuredBook.author
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2", children: truncateDesc(featuredBook.desc) })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex-shrink-0 ml-3", children: [
                  /* @__PURE__ */ jsxs("span", { className: "text-blue-400 text-xs font-medium block mb-2", children: [
                    "🔥 ",
                    featuredBook.status
                  ] }),
                  /* @__PURE__ */ jsx(Link, { to: `/book/${featuredBook.id}`, children: /* @__PURE__ */ jsx(Button, { size: "small", className: "bg-blue-500 hover:bg-blue-600 border-0 text-xs px-2 py-1", children: "立即阅读" }) })
                ] })
              ] }),
              featuredBook.lastChapter && /* @__PURE__ */ jsx("div", { className: "mt-2 p-2 bg-gray-100 dark:bg-gray-600 rounded text-xs", children: /* @__PURE__ */ jsxs("div", { className: "text-gray-600 dark:text-gray-300", children: [
                "📖 最新: ",
                featuredBook.lastChapter
              ] }) })
            ] })
          ] }) }) }, featuredBook.id);
        }) })
      ] }),
      /* @__PURE__ */ jsx(Card, { className: "mb-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300", children: /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
        /* @__PURE__ */ jsx("h4", { className: "text-gray-900 dark:text-white font-bold text-lg mb-4", children: "⚡ 快捷功能" }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-4 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2", children: /* @__PURE__ */ jsx(BookOpen, { className: "h-6 w-6 text-white" }) }),
            /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-600 dark:text-gray-300", children: "我的书架" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mx-auto mb-2", children: /* @__PURE__ */ jsx(Crown, { className: "h-6 w-6 text-white" }) }),
            /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-600 dark:text-gray-300", children: "排行榜" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-2", children: /* @__PURE__ */ jsx(Heart, { className: "h-6 w-6 text-white" }) }),
            /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-600 dark:text-gray-300", children: "收藏夹" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-2", children: /* @__PURE__ */ jsx(User, { className: "h-6 w-6 text-white" }) }),
            /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-600 dark:text-gray-300", children: "个人中心" })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(Card, { className: "mb-6 bg-gradient-to-r from-blue-900 to-blue-800 border-0", children: /* @__PURE__ */ jsxs("div", { className: "p-4 text-white", children: [
        /* @__PURE__ */ jsx("h4", { className: "font-bold text-lg mb-2", children: "🎉 限时福利" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-blue-100 mb-3", children: "新用户注册即送30天VIP体验 · 无广告阅读" }),
        /* @__PURE__ */ jsx(Button, { size: "small", className: "bg-white text-blue-600 border-0 font-bold", children: "立即领取 →" })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-4 mb-6 shadow-lg", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-white mb-2", children: "🎯 精品分类推荐" }),
        /* @__PURE__ */ jsx("p", { className: "text-blue-100 text-sm", children: "精心挑选各类优质小说，满足您的阅读需求" }),
        /* @__PURE__ */ jsxs("div", { className: "mt-3 flex justify-center items-center space-x-4 text-xs text-blue-100", children: [
          /* @__PURE__ */ jsxs("span", { className: "flex items-center", children: [
            /* @__PURE__ */ jsx(Award, { className: "h-3 w-3 mr-1" }),
            "品质保证"
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "flex items-center", children: [
            /* @__PURE__ */ jsx(TrendingUp, { className: "h-3 w-3 mr-1" }),
            "热门推荐"
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "flex items-center", children: [
            /* @__PURE__ */ jsx(Heart, { className: "h-3 w-3 mr-1" }),
            "精品内容"
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "space-y-6", children: categories && categories.map((category) => {
        const hasBooks = category.books && category.books.length > 0;
        return /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 transition-colors duration-300", children: [
          /* @__PURE__ */ jsx("div", { className: "bg-gray-100 dark:bg-gray-700 p-4 border-l-4 border-blue-500", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxs("h3", { className: "text-gray-900 dark:text-white font-bold text-lg mb-1", children: [
                "📚 ",
                category.name
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-gray-400 dark:text-gray-400 text-sm", children: hasBooks ? /* @__PURE__ */ jsxs(Fragment, { children: [
                "💎 ",
                category.books.length,
                "本精品 · 🔥火热更新 · ⭐品质保证"
              ] }) : "🎯 敬请期待更多精彩内容" })
            ] }),
            hasBooks && /* @__PURE__ */ jsxs("div", { className: "flex space-x-2", children: [
              /* @__PURE__ */ jsx("span", { className: "bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold", children: "🔥 热门" }),
              /* @__PURE__ */ jsx("span", { className: "bg-indigo-500 text-white px-2 py-1 rounded-full text-xs font-bold", children: "✨ 新书" })
            ] })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "p-4", children: hasBooks ? /* @__PURE__ */ jsx("div", { className: "space-y-3", children: category.books.map((book, index) => /* @__PURE__ */ jsx(Card, { className: "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 hover:shadow-lg", children: /* @__PURE__ */ jsx(Card.Body, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex space-x-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative flex-shrink-0", children: [
              book.bookImage && /* @__PURE__ */ jsx(
                "img",
                {
                  src: book.bookImage,
                  alt: book.name,
                  className: "w-16 h-20 object-cover rounded",
                  onError: (e) => {
                    const target = e.target;
                    target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDIwMCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NiA2NEw5MCA3Nkw5NCA2NEgxMTBMMTMyIDEyOEwxMDggMTQ0SDkwSDEwOEw5NCAxMTZMMTAwIDEwOEw5NiA5Nkg4NlpNMTI0IDExMkwxMjggMTIwUTEyNiAxMzAgMTIyIDEzMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+";
                  }
                }
              ),
              index < 3 && /* @__PURE__ */ jsx("div", { className: "absolute -top-1 -left-1", children: /* @__PURE__ */ jsxs("div", { className: `${index === 0 ? "bg-blue-500" : index === 1 ? "bg-indigo-500" : "bg-purple-500"} text-white px-2 py-1 rounded text-xs font-bold flex items-center`, children: [
                index === 0 ? "👑" : index === 1 ? "🥈" : "🥉",
                " TOP",
                index + 1
              ] }) }),
              /* @__PURE__ */ jsx("div", { className: "absolute -bottom-1 -right-1", children: /* @__PURE__ */ jsx("span", { className: `${book.status.includes("连载") ? "bg-green-500" : "bg-blue-500"} text-white px-2 py-1 rounded text-xs font-bold`, children: book.status }) })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsx("h4", { className: "text-gray-900 dark:text-white font-bold text-base mb-2 line-clamp-2 leading-tight", children: book.name }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center text-sm text-gray-400 dark:text-gray-400 mb-3", children: [
                  /* @__PURE__ */ jsx(User, { className: "h-4 w-4 mr-1" }),
                  /* @__PURE__ */ jsx("span", { className: "truncate", children: book.author })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2", children: truncateDesc(book.desc) }),
                book.lastChapter && /* @__PURE__ */ jsx("div", { className: "mb-3 p-2 bg-gray-100 dark:bg-gray-600 rounded text-sm", children: /* @__PURE__ */ jsxs("div", { className: "text-gray-600 dark:text-gray-300", children: [
                  "📖 最新: ",
                  book.lastChapter
                ] }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex-shrink-0 ml-3 flex flex-col items-end space-y-2", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-1", children: [
                  /* @__PURE__ */ jsx(Star, { className: "h-4 w-4 text-yellow-500" }),
                  /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-400 dark:text-gray-400", children: "9.2" })
                ] }),
                /* @__PURE__ */ jsx(Link, { to: `/book/${book.id}`, children: /* @__PURE__ */ jsx(
                  Button,
                  {
                    size: "small",
                    className: "bg-blue-500 hover:bg-blue-600 border-0 text-sm px-3 py-1 font-bold",
                    children: "📖 阅读"
                  }
                ) })
              ] })
            ] }) })
          ] }) }) }, book.id)) }) : (
            /* 空分类状态 */
            /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
              /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx(BookOpen, { className: "h-8 w-8 text-gray-400 dark:text-gray-400" }) }),
              /* @__PURE__ */ jsx("h4", { className: "text-gray-400 dark:text-gray-400 font-medium mb-2", children: "精彩即将呈现" }),
              /* @__PURE__ */ jsxs("p", { className: "text-gray-500 dark:text-gray-500 text-sm", children: [
                "我们正在精心策划优质的",
                category.name,
                "小说内容，敬请期待！"
              ] })
            ] })
          ) })
        ] }, category.id);
      }) }),
      /* @__PURE__ */ jsx(Card, { className: "mt-6 mb-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300", children: /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
        /* @__PURE__ */ jsx("h4", { className: "font-bold text-gray-900 dark:text-white mb-4 text-center", children: "🔥 为什么选择夜读小说网？" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg", children: [
            /* @__PURE__ */ jsxs("span", { className: "flex items-center text-gray-600 dark:text-gray-300", children: [
              /* @__PURE__ */ jsx(Award, { className: "h-5 w-5 mr-3 text-blue-500" }),
              "精选优质内容"
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-blue-500 font-bold", children: "✓" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg", children: [
            /* @__PURE__ */ jsxs("span", { className: "flex items-center text-gray-600 dark:text-gray-300", children: [
              /* @__PURE__ */ jsx(TrendingUp, { className: "h-5 w-5 mr-3 text-green-500" }),
              "每日持续更新"
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-green-500 font-bold", children: "✓" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg", children: [
            /* @__PURE__ */ jsxs("span", { className: "flex items-center text-gray-600 dark:text-gray-300", children: [
              /* @__PURE__ */ jsx(Heart, { className: "h-5 w-5 mr-3 text-purple-500" }),
              "个性化推荐"
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-purple-500 font-bold", children: "✓" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg", children: [
            /* @__PURE__ */ jsxs("span", { className: "flex items-center text-gray-600 dark:text-gray-300", children: [
              /* @__PURE__ */ jsx(Star, { className: "h-5 w-5 mr-3 text-yellow-500" }),
              "无广告阅读"
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-yellow-500 font-bold", children: "✓" })
          ] })
        ] })
      ] }) }),
      isLoading && /* @__PURE__ */ jsx(Card, { className: "mt-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300", children: /* @__PURE__ */ jsx("div", { className: "p-8 text-center", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center", children: [
        /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mr-3" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "font-medium text-gray-900 dark:text-white", children: "正在加载精彩小说..." }),
          /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-400 dark:text-gray-400", children: "请稍候" })
        ] })
      ] }) }) }),
      error && /* @__PURE__ */ jsx(Card, { className: "mt-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300", children: /* @__PURE__ */ jsxs("div", { className: "p-8 text-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-blue-400 mb-4", children: [
          /* @__PURE__ */ jsx("div", { className: "text-4xl mb-2", children: "😵" }),
          /* @__PURE__ */ jsx("div", { className: "font-medium text-gray-900 dark:text-white", children: "加载失败" }),
          /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-400 dark:text-gray-400", children: error instanceof Error ? error.message : "未知错误" })
        ] }),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "primary",
            size: "small",
            className: "bg-blue-500 hover:bg-blue-600 border-0",
            onClick: () => window.location.reload(),
            children: "🔄 重新加载"
          }
        )
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("footer", { className: "bg-gray-800 dark:bg-gray-800 border-t border-gray-700 dark:border-gray-700 py-8 mt-8 transition-colors duration-300", children: /* @__PURE__ */ jsxs("div", { className: "px-4 text-center", children: [
      /* @__PURE__ */ jsx("h4", { className: "font-bold text-white mb-3 text-lg", children: "📚 夜读小说网" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400 dark:text-gray-400 mb-4", children: "发现更多精彩故事 · 享受沉浸式阅读时光" }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-center space-x-6 text-sm text-gray-500 dark:text-gray-500 mb-4", children: [
        /* @__PURE__ */ jsxs("span", { className: "flex items-center", children: [
          /* @__PURE__ */ jsx(Award, { className: "h-4 w-4 mr-1 text-blue-500" }),
          "品质"
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "flex items-center", children: [
          /* @__PURE__ */ jsx(TrendingUp, { className: "h-4 w-4 mr-1 text-green-500" }),
          "更新"
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "flex items-center", children: [
          /* @__PURE__ */ jsx(Heart, { className: "h-4 w-4 mr-1 text-purple-500" }),
          "推荐"
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "flex items-center", children: [
          /* @__PURE__ */ jsx(Star, { className: "h-4 w-4 mr-1 text-yellow-500" }),
          "体验"
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "border-t border-gray-700 dark:border-gray-700 pt-4", children: /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 dark:text-gray-500", children: "© 2025 夜读小说网 · 专业的在线阅读平台" }) })
    ] }) })
  ] });
}

const baseUrl$4 = undefined                            ;
const imgHost$4 = undefined                            ;
async function fetchCategories$1() {
  try {
    const response = await fetch(baseUrl$4, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        sql: `SELECT 
          c.id,
          c.name,
          c."createTime",
          c."updateTime",
          c."deleteFlag",
          COALESCE(
            json_agg(
              CASE 
                WHEN b.id IS NOT NULL THEN 
                  json_build_object(
                    'id', b.id,
                    'name', b."name",
                    'desc', b."desc",
                    'bookImage', b."bookImage",
                    'status', b."status",
                    'fired',b."fired",
                    'author', a."name",
                    'authorId', b."authorId",
                    'lastChapter', b."lastChapter"
                  )
                ELSE NULL
              END
              ORDER BY b."createTime" ASC
            ) FILTER (WHERE b.id IS NOT NULL),
            '[]'::json
          ) as books
        FROM public.category c
        LEFT JOIN (
          SELECT *
          FROM (
            SELECT *,
                   ROW_NUMBER() OVER (PARTITION BY "categoryId" ORDER BY "createTime" ASC) as rn
            FROM public.book 
            WHERE "deleteFlag" = false
          ) ranked_books
          WHERE rn <= 3
        ) b ON c.id = b."categoryId"
        LEFT JOIN public.author a ON b."authorId" = a.id
        WHERE c."deleteFlag" = false
        GROUP BY c.id, c.name, c."createTime", c."updateTime", c."deleteFlag"
        ORDER BY c."createTime" DESC`
      })
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || "获取分类数据失败");
    }
    const processedData = result.data?.map((category) => ({
      ...category,
      books: category.books?.map((book) => ({
        ...book,
        bookImage: book.bookImage ? `${imgHost$4}${book.bookImage}` : void 0
      })) || []
    })) || [];
    return processedData;
  } catch (error) {
    console.error("获取分类数据失败:", error);
    throw error;
  }
}
async function fetchHotBooks() {
  try {
    const response = await fetch(baseUrl$4, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        sql: `SELECT 
          b.id,
          b."name",
          b."fired",
          b.status,
          a."name" as "author",
          b."authorId"
        FROM public.book b
        LEFT JOIN public.author a ON b."authorId" = a.id
        WHERE b."deleteFlag" = false AND b."isShow" = true
        ORDER BY b."fired" DESC
        LIMIT 5`
      })
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || "获取热门书籍数据失败");
    }
    console.log(result.data);
    return result.data || [];
  } catch (error) {
    console.error("获取热门书籍数据失败:", error);
    throw error;
  }
}
function useCategories$1() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories$1
  });
}
function useHotBooks() {
  return useQuery({
    queryKey: ["hotBooks"],
    queryFn: fetchHotBooks
  });
}
function formatHeat$3(fired) {
  if (fired >= 1e4) {
    return `🔥 ${(fired / 1e4).toFixed(1)}万`;
  } else if (fired >= 1e3) {
    return `🔥 ${(fired / 1e3).toFixed(1)}千`;
  } else {
    return `🔥 ${fired}`;
  }
}
const index$4 = UNSAFE_withComponentProps(function Home() {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  return /* @__PURE__ */ jsx("div", {
    className: "min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300",
    children: isMobile ? /* @__PURE__ */ jsx(Mobile$4, {}) : /* @__PURE__ */ jsx(PC$4, {})
  });
});

const route1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index$4,
  formatHeat: formatHeat$3,
  useCategories: useCategories$1,
  useHotBooks
}, Symbol.toStringTag, { value: 'Module' }));

const imgHost$3 = undefined                            ;
function PC$3() {
  const { data: book, isLoading: bookLoading, error: bookError } = useBookDetail();
  const { data: chapters, isLoading: chaptersLoading, error: chaptersError } = useChapters();
  const { data: relatedBooks, isLoading: relatedLoading } = useRelatedBooks(
    book?.categoryId || "",
    book?.id || ""
  );
  if (bookLoading) {
    return /* @__PURE__ */ jsx("div", { className: "book-detail-container", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center min-h-screen", children: [
      /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" }),
      /* @__PURE__ */ jsx("span", { className: "ml-4 text-gray-600 dark:text-gray-300", children: "正在加载书籍信息..." })
    ] }) });
  }
  if (bookError) {
    return /* @__PURE__ */ jsx("div", { className: "book-detail-container", children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-screen", children: /* @__PURE__ */ jsxs(Card, { className: "p-8 text-center max-w-md", children: [
      /* @__PURE__ */ jsx("div", { className: "text-6xl mb-4", children: "😵" }),
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-gray-900 dark:text-white mb-4", children: "加载失败" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-400 dark:text-gray-400 mb-6", children: bookError instanceof Error ? bookError.message : "无法获取书籍信息" }),
      /* @__PURE__ */ jsx(Button, { onClick: () => window.location.reload(), className: "bg-blue-500 hover:bg-blue-600", children: "🔄 重新加载" }),
      /* @__PURE__ */ jsx(Link, { to: "/", children: /* @__PURE__ */ jsx(Button, { className: "bg-blue-500 hover:bg-blue-600", children: "🔄 回到首页" }) })
    ] }) }) });
  }
  if (!book) {
    return /* @__PURE__ */ jsx("div", { className: "book-detail-container", children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-screen", children: /* @__PURE__ */ jsxs(Card, { className: "p-8 text-center max-w-md", children: [
      /* @__PURE__ */ jsx("div", { className: "text-6xl mb-4", children: "📚" }),
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-gray-900 dark:text-white mb-4", children: "书籍不存在" }),
      /* @__PURE__ */ jsx(Link, { to: "/home", children: /* @__PURE__ */ jsx(Button, { className: "bg-blue-500 hover:bg-blue-600", children: "🏠 返回首页" }) })
    ] }) }) });
  }
  const handleStartReading = () => {
    if (chapters && chapters.length > 0) {
      handleChapterClick(chapters[0].id, book.id);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "book-detail-container", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-6 py-8 dark:bg-gray-600", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-8", children: [
      /* @__PURE__ */ jsxs("main", { className: "flex-1 space-y-8", children: [
        /* @__PURE__ */ jsx(Card, { className: "book-info", children: /* @__PURE__ */ jsxs("div", { className: "flex space-x-6", children: [
          /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: book.bookImage ? /* @__PURE__ */ jsx(
            "img",
            {
              src: `${imgHost$3}${book.bookImage}`,
              alt: book.name,
              className: "book-cover",
              onError: (e) => {
                const target = e.target;
                target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDIwMCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NiA2NEw5MCA3Nkw5NCA2NEgxMTBMMTMyIDEyOEwxMDggMTQ0SDkwSDEwOEw5NCAxMTZMMTAwIDEwOEw5NiA5Nkg4NlpNMTI0IDExMkwxMjggMTIwUTEyNiAxMzAgMTIyIDEzMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+";
              }
            }
          ) : /* @__PURE__ */ jsx("div", { className: "book-cover bg-gray-200 dark:bg-gray-700 flex items-center justify-center", children: /* @__PURE__ */ jsx(BookOpen, { className: "h-12 w-12 text-gray-400" }) }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0 px-2", children: [
            /* @__PURE__ */ jsx("h1", { className: "book-title", children: book.name }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4 mb-3", children: [
              /* @__PURE__ */ jsx(Link, { to: `/author/${book.authorId}`, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center text-gray-600 dark:text-gray-300", children: [
                /* @__PURE__ */ jsx(User, { className: "h-4 w-4 mr-1" }),
                /* @__PURE__ */ jsx("span", { children: book.authorName })
              ] }) }),
              /* @__PURE__ */ jsx(Link, { to: `/category/${book.categoryId}`, children: /* @__PURE__ */ jsx("span", { className: "book-category", children: book.categoryName }) }),
              /* @__PURE__ */ jsx("span", { className: "book-status", children: book.status })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "book-desc mb-6", children: book.desc }),
            /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-4 w-[95%]", children: /* @__PURE__ */ jsx(
              Button,
              {
                className: "btn-primary ",
                size: "large",
                onClick: handleStartReading,
                disabled: !chapters || chapters.length === 0,
                children: "📖 开始阅读"
              }
            ) })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs(Card, { className: "chapters-container", children: [
          /* @__PURE__ */ jsxs("div", { className: "chapters-header", children: [
            /* @__PURE__ */ jsxs("h2", { className: "chapters-title", children: [
              "📚 全部章节",
              /* @__PURE__ */ jsxs("span", { className: "chapters-count ml-2", children: [
                "(",
                chapters?.length || 0,
                "章)"
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-2", children: book.lastChapter && /* @__PURE__ */ jsxs("span", { className: "text-sm text-gray-500 dark:text-gray-400", children: [
              "📖 最新: ",
              book.lastChapter
            ] }) })
          ] }),
          chaptersLoading ? /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center py-8", children: [
            /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" }),
            /* @__PURE__ */ jsx("span", { className: "ml-2 text-gray-600", children: "正在加载章节列表..." })
          ] }) : chaptersError ? /* @__PURE__ */ jsx("div", { className: "text-center py-8 text-red-500", children: /* @__PURE__ */ jsxs("p", { children: [
            "章节加载失败: ",
            chaptersError instanceof Error ? chaptersError.message : "未知错误"
          ] }) }) : chapters && chapters.length > 0 ? /* @__PURE__ */ jsx("div", { className: "chapters-grid", children: chapters.map((chapter, index) => /* @__PURE__ */ jsx(
            "div",
            {
              className: "chapter-grid-item",
              onClick: () => handleChapterClick(chapter.id, book.id),
              children: /* @__PURE__ */ jsx("div", { className: "chapter-grid-name", children: chapter.name })
            },
            chapter.id
          )) }) : /* @__PURE__ */ jsxs("div", { className: "text-center py-8 text-gray-500", children: [
            /* @__PURE__ */ jsx(BookOpen, { className: "h-12 w-12 mx-auto mb-4 text-gray-300" }),
            /* @__PURE__ */ jsx("p", { children: "暂无章节信息" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("aside", { className: "w-80 flex-shrink-0 space-y-6", children: [
        /* @__PURE__ */ jsxs(Card, { className: "p-4", children: [
          /* @__PURE__ */ jsx("h4", { className: "font-bold text-gray-900 dark:text-white mb-4", children: "📊 书籍信息" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-600 dark:text-gray-300", children: "状态" }),
              /* @__PURE__ */ jsx("span", { className: "text-green-600 dark:text-green-400 font-medium", children: book.status })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-600 dark:text-gray-300", children: "分类" }),
              /* @__PURE__ */ jsx(Link, { to: `/category/${book.categoryId}`, children: /* @__PURE__ */ jsx("span", { className: "text-blue-600 dark:text-blue-400 font-medium", children: book.categoryName }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-600 dark:text-gray-300", children: "热度" }),
              /* @__PURE__ */ jsx("span", { className: "text-orange-600 dark:text-orange-400 font-medium", children: book.fired })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-600 dark:text-gray-300", children: "章节数" }),
              /* @__PURE__ */ jsx("span", { className: "text-gray-900 dark:text-white font-medium", children: chapters?.length || 0 })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-600 dark:text-gray-300", children: "更新时间" }),
              /* @__PURE__ */ jsx("span", { className: "text-gray-500 dark:text-gray-400 text-sm", children: book.updateTime ? new Date(book.updateTime).toLocaleDateString() : "-" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Card, { className: "p-4", children: [
          /* @__PURE__ */ jsx("h4", { className: "font-bold text-gray-900 dark:text-white mb-4", children: "⚡ 快捷操作" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                block: true,
                className: "bg-blue-500 hover:bg-blue-600 text-white my-1",
                onClick: handleStartReading,
                disabled: !chapters || chapters.length === 0,
                children: "📖 立即阅读"
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                block: true,
                className: "my-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-white",
                onClick: () => handleBookmark(book.id),
                children: "🔖 收藏本书"
              }
            )
          ] })
        ] }),
        relatedBooks && relatedBooks.length > 0 && /* @__PURE__ */ jsxs(Card, { className: "related-books", children: [
          /* @__PURE__ */ jsx("h3", { className: "related-title", children: "📖 相关推荐" }),
          /* @__PURE__ */ jsx("div", { className: "space-y-3", children: relatedBooks.map((relatedBook) => /* @__PURE__ */ jsxs(
            Link,
            {
              to: `/book/${relatedBook.id}`,
              className: "related-item group",
              children: [
                /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: `${undefined                            }${relatedBook.bookImage}`,
                    alt: relatedBook.name,
                    className: "related-book-cover",
                    loading: "lazy"
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "related-book-info", children: [
                  /* @__PURE__ */ jsx("h4", { className: "related-book-title", children: relatedBook.name }),
                  /* @__PURE__ */ jsx(Link, { className: "wy-1 block", to: `/author/${relatedBook.authorId}`, children: /* @__PURE__ */ jsxs("div", { className: "related-book-author", children: [
                    /* @__PURE__ */ jsx(User, { className: "h-3 w-3 mr-1" }),
                    relatedBook.authorName
                  ] }) }),
                  /* @__PURE__ */ jsx("div", { className: "related-book-meta", children: /* @__PURE__ */ jsxs("div", { className: "related-book-status", children: [
                    /* @__PURE__ */ jsx(Clock, { className: "h-3 w-3 mr-1" }),
                    /* @__PURE__ */ jsx("span", { children: "连载中" })
                  ] }) })
                ] })
              ]
            },
            relatedBook.id
          )) })
        ] })
      ] })
    ] }) })
  ] });
}

function Mobile$3() {
  const { data: book, isLoading: bookLoading, error: bookError } = useBookDetail();
  const { data: chapters, isLoading: chaptersLoading, error: chaptersError } = useChapters();
  const { data: relatedBooks, isLoading: relatedLoading } = useRelatedBooks(
    book?.categoryId || "",
    book?.id || ""
  );
  if (bookLoading) {
    return /* @__PURE__ */ jsx("div", { className: "book-detail-container", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center min-h-screen", children: [
      /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" }),
      /* @__PURE__ */ jsx("span", { className: "ml-3 text-gray-600 dark:text-gray-300", children: "正在加载书籍信息..." })
    ] }) });
  }
  if (bookError) {
    return /* @__PURE__ */ jsx("div", { className: "book-detail-container", children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-screen p-4", children: /* @__PURE__ */ jsxs(Card, { className: "p-6 text-center max-w-sm w-full", children: [
      /* @__PURE__ */ jsx("div", { className: "text-4xl mb-4", children: "😵" }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-gray-900 dark:text-white mb-4", children: "加载失败" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-400 dark:text-gray-400 mb-6 text-sm", children: bookError instanceof Error ? bookError.message : "无法获取书籍信息" }),
      /* @__PURE__ */ jsx(Button, { onClick: () => window.location.reload(), className: "bg-blue-500 hover:bg-blue-600 w-full", children: "🔄 重新加载" })
    ] }) }) });
  }
  if (!book) {
    return /* @__PURE__ */ jsx("div", { className: "book-detail-container", children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-screen p-4", children: /* @__PURE__ */ jsxs(Card, { className: "p-6 text-center max-w-sm w-full", children: [
      /* @__PURE__ */ jsx("div", { className: "text-4xl mb-4", children: "📚" }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-gray-900 dark:text-white mb-4", children: "书籍不存在" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-400 dark:text-gray-400 mb-6 text-sm", children: "请检查链接是否正确" }),
      /* @__PURE__ */ jsx(Link, { to: "/", children: /* @__PURE__ */ jsx(Button, { className: "bg-blue-500 hover:bg-blue-600 w-full", children: "🏠 返回首页" }) })
    ] }) }) });
  }
  const handleStartReading = () => {
    if (chapters && chapters.length > 0) {
      handleChapterClick(chapters[0].id, book.id);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "book-detail-container", children: [
    /* @__PURE__ */ jsx("nav", { className: "bg-white dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200 sticky top-0 z-50", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-4 py-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
        /* @__PURE__ */ jsx(Link, { to: "/", className: "p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 rounded-lg", children: /* @__PURE__ */ jsx(ArrowLeft, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsx("h1", { className: "text-lg font-bold text-gray-900 dark:text-white truncate max-w-48", children: book.name })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 rounded-lg",
            onClick: () => handleShare(book.id, book.name),
            children: /* @__PURE__ */ jsx(Share, { className: "h-5 w-5" })
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 rounded-lg",
            onClick: () => handleBookmark(book.id),
            children: /* @__PURE__ */ jsx(Heart, { className: "h-5 w-5" })
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "px-4 py-4 space-y-4", children: [
      /* @__PURE__ */ jsxs(Card, { className: "book-info", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex space-x-4", children: [
          /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: book.bookImage ? /* @__PURE__ */ jsx(
            "img",
            {
              src: book.bookImage,
              alt: book.name,
              className: "w-24 h-32 object-cover rounded",
              onError: (e) => {
                const target = e.target;
                target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDIwMCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NiA2NEw5MCA3Nkw5NCA2NEgxMTBMMTMyIDEyOEwxMDggMTQ0SDkwSDEwOEw5NCAxMTZMMTAwIDEwOEw5NiA5Nkg4NlpNMTI0IDExMkwxMjggMTIwUTEyNiAxMzAgMTIyIDEzMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+";
              }
            }
          ) : /* @__PURE__ */ jsx("div", { className: "w-24 h-32 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded", children: /* @__PURE__ */ jsx(BookOpen, { className: "h-8 w-8 text-gray-400" }) }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight", children: book.name }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2 mb-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center text-gray-600 dark:text-gray-300 text-sm", children: [
                /* @__PURE__ */ jsx(User, { className: "h-4 w-4 mr-2" }),
                /* @__PURE__ */ jsx("span", { children: book.author.name })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
                /* @__PURE__ */ jsx("span", { className: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs", children: book.category?.name || "未分类" }),
                /* @__PURE__ */ jsx("span", { className: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded text-xs", children: book.status })
              ] })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-700 dark:text-gray-300 text-sm leading-relaxed line-clamp-3", children: book.desc })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-4 pt-4 border-t border-gray-200 dark:border-gray-700", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              className: "bg-blue-500 hover:bg-blue-600 text-white font-bold",
              onClick: handleStartReading,
              disabled: !chapters || chapters.length === 0,
              children: "📖 开始阅读"
            }
          ),
          /* @__PURE__ */ jsxs(
            Button,
            {
              className: "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-700 dark:text-white",
              onClick: () => handleBookmark(book.id),
              children: [
                /* @__PURE__ */ jsx(Heart, { className: "h-4 w-4 mr-2" }),
                "收藏"
              ]
            }
          )
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "chapters-container", children: [
        /* @__PURE__ */ jsxs("div", { className: "chapters-header mb-4", children: [
          /* @__PURE__ */ jsxs("h2", { className: "text-lg font-bold text-gray-900 dark:text-white", children: [
            "📚 全部章节",
            /* @__PURE__ */ jsxs("span", { className: "text-sm text-gray-500 ml-2", children: [
              "(",
              chapters?.length || 0,
              "章)"
            ] })
          ] }),
          book.lastChapter && /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-1", children: [
            "📖 最新: ",
            book.lastChapter
          ] })
        ] }),
        chaptersLoading ? /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center py-8", children: [
          /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent" }),
          /* @__PURE__ */ jsx("span", { className: "ml-2 text-gray-600 text-sm", children: "正在加载章节列表..." })
        ] }) : chaptersError ? /* @__PURE__ */ jsx("div", { className: "text-center py-8 text-red-500 text-sm", children: /* @__PURE__ */ jsxs("p", { children: [
          "章节加载失败: ",
          chaptersError instanceof Error ? chaptersError.message : "未知错误"
        ] }) }) : chapters && chapters.length > 0 ? /* @__PURE__ */ jsx("div", { className: "space-y-1 max-h-96 overflow-y-auto", children: chapters.map((chapter) => /* @__PURE__ */ jsx("div", { className: "border-b border-gray-100 dark:border-gray-700 last:border-b-0 py-3", children: /* @__PURE__ */ jsxs(
          Link,
          {
            to: "#",
            className: "chapter-link flex items-center justify-between",
            onClick: () => handleChapterClick(chapter.id, book.id),
            children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-700 dark:text-gray-300 text-sm font-medium truncate mr-4", children: chapter.name }),
              /* @__PURE__ */ jsxs("span", { className: "text-gray-400 dark:text-gray-500 text-xs flex-shrink-0", children: [
                "#",
                chapter.idx
              ] })
            ]
          }
        ) }, chapter.id)) }) : /* @__PURE__ */ jsxs("div", { className: "text-center py-8 text-gray-500", children: [
          /* @__PURE__ */ jsx(BookOpen, { className: "h-8 w-8 mx-auto mb-2 text-gray-300" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm", children: "暂无章节信息" })
        ] })
      ] }),
      relatedBooks && relatedBooks.length > 0 && /* @__PURE__ */ jsxs(Card, { className: "related-books", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-gray-900 dark:text-white mb-4", children: "📖 相关推荐" }),
        /* @__PURE__ */ jsx("div", { className: "space-y-3", children: relatedBooks.map((relatedBook) => /* @__PURE__ */ jsxs(
          Link,
          {
            to: `/book/${relatedBook.id}`,
            className: "flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors",
            children: [
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: relatedBook.bookImage ? `${undefined                            }${relatedBook.bookImage}` : "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDIwMCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NiA2NEw5MCA3Nkw5NCA2NEgxMTBMMTMyIDEyOEwxMDggMTQ0SDkwSDEwOEw5NCAxMTZMMTAwIDEwOEw5NiA5Nkg4NlpNMTI0IDExMkwxMjggMTIwUTEyNiAxMzAgMTIyIDEzMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+",
                  alt: relatedBook.name,
                  className: "w-12 h-16 object-cover rounded"
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsx("h4", { className: "text-sm font-medium text-gray-900 dark:text-white line-clamp-2", children: relatedBook.name }),
                /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-1", children: [
                  "👤 ",
                  relatedBook.authorName
                ] }),
                relatedBook.lastChapter && /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-1 truncate", children: [
                  "📖 ",
                  relatedBook.lastChapter
                ] })
              ] })
            ]
          },
          relatedBook.id
        )) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 z-50", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            className: "bg-blue-500 hover:bg-blue-600 text-white font-bold",
            onClick: handleStartReading,
            disabled: !chapters || chapters.length === 0,
            children: "📖 立即阅读"
          }
        ),
        /* @__PURE__ */ jsxs(
          Button,
          {
            className: "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-700 dark:text-white",
            onClick: () => handleBookmark(book.id),
            children: [
              /* @__PURE__ */ jsx(Heart, { className: "h-4 w-4 mr-2" }),
              "收藏本书"
            ]
          }
        )
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "h-20" })
    ] })
  ] });
}

const baseUrl$3 = undefined                            ;
async function fetchBookDetail(bookId) {
  try {
    const response = await fetch(baseUrl$3, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        sql: `
        SELECT 
          b.id,
          b."name",
          b.desc,
          b."bookImage",
          b."fired",
          b.status,
          b."categoryId",
          b."authorId",
          b."lastChapter",
          b."createTime",
          b."updateTime",
          b."isShow",
          b."deleteFlag",
          b."originUrl",
          a."name" as "authorName",
          a.id as "authorId",
          c."name" as "categoryName",
          c.id as "categoryId"
        FROM public.book b
        LEFT JOIN public.author a ON b."authorId" = a.id
        LEFT JOIN public.category c ON b."categoryId" = c.id
        WHERE b.id ='${bookId}' AND b."deleteFlag" = false
       `
      })
    });
    await fetch(baseUrl$3, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        sql: `
        UPDATE public.book SET "fired"="fired"+1 WHERE id = '${bookId}'`
      })
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || "获取书籍详情失败");
    }
    if (!result.data) {
      throw new Error("书籍不存在");
    }
    const bookData = result.data;
    if (bookData && Array.isArray(bookData)) {
      return bookData[0];
    }
  } catch (error) {
    console.error("获取书籍详情失败:", error);
    throw error;
  }
}
async function fetchChapters(bookId) {
  try {
    const response = await fetch(baseUrl$3, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        sql: `SELECT 
          id,
          idx,
          "name",
          "createTime",
          "updateTime"
        FROM public.chapter
        WHERE "bookId" = '${bookId}'
        ORDER BY "idx" ASC`
      })
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || "获取章节列表失败");
    }
    return result.data || [];
  } catch (error) {
    console.error("获取章节列表失败:", error);
    throw error;
  }
}
async function fetchRelatedBooks(categoryId, currentBookId) {
  try {
    const response = await fetch(baseUrl$3, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        sql: `SELECT 
          b.id,
          b."name",
          b."bookImage",
          b."lastChapter",
          b status,
          a."name" as "authorName",
          b."authorId" as "authorId"
        FROM public.book b
        LEFT JOIN public.author a ON b."authorId" = a.id
        WHERE b."categoryId" = '${categoryId}' AND b."deleteFlag" = false AND b.id != '${currentBookId}'
        LIMIT 6`
      })
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || "获取相关书籍失败");
    }
    return result.data || [];
  } catch (error) {
    console.error("获取相关书籍失败:", error);
    throw error;
  }
}
function useBookDetail() {
  const {
    bookId
  } = useParams();
  return useQuery({
    queryKey: ["book", bookId],
    queryFn: () => fetchBookDetail(bookId),
    enabled: !!bookId
  });
}
function useChapters() {
  const {
    bookId
  } = useParams();
  return useQuery({
    queryKey: ["chapters", bookId],
    queryFn: () => fetchChapters(bookId),
    enabled: !!bookId
  });
}
function useRelatedBooks(categoryId, currentBookId) {
  return useQuery({
    queryKey: ["relatedBooks", categoryId, currentBookId],
    queryFn: () => fetchRelatedBooks(categoryId, currentBookId),
    enabled: !!categoryId && !!currentBookId
  });
}
function handleChapterClick(chapterId, bookId) {
  console.log(`跳转到阅读页面 - 书籍ID: '${bookId}', 章节ID: '${chapterId}'`);
}
function handleBookmark(bookId) {
  console.log(`收藏书籍: '${bookId}'`);
}
function handleShare(bookId, bookName) {
  console.log(`分享书籍: ${bookName} ('${bookId}')`);
}
const index$3 = UNSAFE_withComponentProps(function BookDetail() {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  return /* @__PURE__ */ jsx("div", {
    className: "min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300",
    children: isMobile ? /* @__PURE__ */ jsx(Mobile$3, {}) : /* @__PURE__ */ jsx(PC$3, {})
  });
});

const route2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index$3,
  handleBookmark,
  handleChapterClick,
  handleShare,
  useBookDetail,
  useChapters,
  useRelatedBooks
}, Symbol.toStringTag, { value: 'Module' }));

function BookCard({
  book,
  layout = "pc",
  showRank = false,
  rank = 0,
  className = "",
  truncateLength = 100
}) {
  const truncateDesc = (desc) => {
    if (!desc) return "";
    return desc.length > truncateLength ? desc.substring(0, truncateLength) + "..." : desc;
  };
  if (layout === "mobile") {
    return /* @__PURE__ */ jsx(Card, { className: `bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-all duration-200 hover:shadow-lg ${className}`, children: /* @__PURE__ */ jsx(Card.Body, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex space-x-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative flex-shrink-0", children: [
        book.bookImage && /* @__PURE__ */ jsx(
          "img",
          {
            src: book.bookImage,
            alt: book.name,
            className: "w-20 h-28 object-cover rounded",
            onError: (e) => {
              const target = e.target;
              target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDIwMCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NiA2NEw5MCA3Nkw5NCA2NEgxMTBMMTMyIDEyOEwxMDggMTQ0SDkwSDEwOEw5NCAxMTZMMTAwIDEwOEw5NiA5Nkg4NlpNMTI0IDExMkwxMjggMTIwUTEyNiAxMzAgMTIyIDEzMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+";
            }
          }
        ),
        showRank && rank < 3 && /* @__PURE__ */ jsx("div", { className: "absolute -top-1 -left-1", children: /* @__PURE__ */ jsxs("div", { className: `${rank === 0 ? "bg-blue-500" : rank === 1 ? "bg-indigo-500" : "bg-purple-500"} text-white px-2 py-1 rounded text-xs font-bold flex items-center`, children: [
          rank === 0 ? "👑" : rank === 1 ? "🥈" : "🥉",
          " TOP",
          rank + 1
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "absolute -bottom-1 -right-1", children: /* @__PURE__ */ jsx("span", { className: `${book.status.includes("连载") ? "bg-green-500" : "bg-blue-500"} text-white px-2 py-1 rounded text-xs font-bold`, children: book.status }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-gray-900 dark:text-white font-bold text-base mb-2 line-clamp-2 leading-tight", children: book.name }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center text-sm text-gray-400 dark:text-gray-400 mb-3", children: [
            /* @__PURE__ */ jsx(User, { className: "h-4 w-4 mr-1" }),
            /* @__PURE__ */ jsx(Link, { to: `/author/${book.authorId}`, children: /* @__PURE__ */ jsx("span", { className: "truncate", children: book.author }) })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2", children: truncateDesc(book.desc) }),
          book.lastChapter && /* @__PURE__ */ jsx("div", { className: "mb-3 p-2 bg-gray-100 dark:bg-gray-600 rounded text-sm", children: /* @__PURE__ */ jsxs("div", { className: "text-gray-600 dark:text-gray-300", children: [
            "📖 最新: ",
            book.lastChapter
          ] }) }),
          book.fired && /* @__PURE__ */ jsx("div", { className: "mb-3", children: /* @__PURE__ */ jsx("span", { className: "bg-red-500 text-white px-2 py-1 rounded text-xs font-bold", children: book.fired > 1e4 ? `${Math.floor(book.fired / 1e4)}w` : `${book.fired}` }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex-shrink-0 ml-3 flex flex-col items-end space-y-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-1", children: [
            /* @__PURE__ */ jsx(Star, { className: "h-4 w-4 text-yellow-500" }),
            /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-400 dark:text-gray-400", children: "9.2" })
          ] }),
          /* @__PURE__ */ jsx(Link, { to: `/book/${book.id}`, children: /* @__PURE__ */ jsx(
            Button,
            {
              size: "small",
              className: "bg-blue-500 hover:bg-blue-600 border-0 text-sm px-3 py-1 font-bold",
              children: "📖 阅读"
            }
          ) })
        ] })
      ] }) })
    ] }) }) });
  }
  return /* @__PURE__ */ jsx(Link, { to: `/book/${book.id}`, children: /* @__PURE__ */ jsx("div", { className: `relative flex-shrink-0 ${className}`, children: /* @__PURE__ */ jsx(Card, { className: "bg-gray-50 w-120 h-45 p-0 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 hover:shadow-lg", children: /* @__PURE__ */ jsx(Card.Body, { className: "py-0!", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
    /* @__PURE__ */ jsx("div", { className: "w-32 h-40 flex-shrink-0", children: book.bookImage && /* @__PURE__ */ jsx(
      "img",
      {
        src: book.bookImage,
        alt: book.name,
        className: "w-full h-full object-cover rounded"
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-3 p-4 relative", children: [
      /* @__PURE__ */ jsx("h4", { className: "text-gray-900 dark:text-white font-bold text-lg leading-tight", children: book.name }),
      /* @__PURE__ */ jsx("div", { className: "pt-2 absolute top-10 right-2", children: /* @__PURE__ */ jsx("span", { className: `${book.status.includes("连载") ? "bg-blue-500" : "bg-gray-500"} text-white px-3 py-1 rounded-full text-sm font-medium`, children: book.status }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center text-sm text-gray-500 dark:text-gray-400", children: [
        /* @__PURE__ */ jsx("svg", { className: "h-4 w-4 mr-1", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" }) }),
        /* @__PURE__ */ jsx(Link, { to: `/author/${book.authorId}`, children: /* @__PURE__ */ jsx("span", { className: "truncate", children: book.author }) })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 dark:text-gray-300 text-sm line-clamp-2 leading-relaxed", children: truncateDesc(book.desc) }),
      /* @__PURE__ */ jsx("div", { className: "space-y-1", children: /* @__PURE__ */ jsxs("div", { className: "text-xs text-gray-500 dark:text-gray-400", children: [
        "最新章节: ",
        book.lastChapter || "暂无更新"
      ] }) })
    ] })
  ] }) }) }) }) }, book.id);
}

function PC$2({
  categories,
  currentCategory,
  books,
  pagination,
  isLoading,
  error,
  onPageChange
}) {
  const { categoryId } = useParams();
  const getBooksPerRow = () => {
    const containerWidth = 1200 - 48;
    const cardWidth = 440;
    const gap = 8;
    const booksPerRow = Math.max(1, Math.floor(containerWidth / (cardWidth + gap)));
    return booksPerRow;
  };
  const getBooksByRow = () => {
    if (books.length === 0) return [];
    const booksPerRow = getBooksPerRow();
    const rows = [];
    for (let i = 0; i < books.length; i += booksPerRow) {
      rows.push(books.slice(i, i + booksPerRow));
    }
    return rows;
  };
  const bookRows = getBooksByRow();
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto pt-6 py-6", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-6", children: [
      /* @__PURE__ */ jsxs("aside", { className: "w-64 flex-shrink-0 flex gap-2 flex-col", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 transition-colors duration-300", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-gray-900 dark:text-white font-bold text-lg", children: "作品分类" }),
            /* @__PURE__ */ jsx("svg", { className: "h-4 w-4 text-gray-400 dark:text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "space-y-1", children: categories && categories.map((category) => /* @__PURE__ */ jsx(
            Link,
            {
              to: category.id === "" ? "/category/''" : `/category/${category.id}`,
              className: `block cursor-pointer px-3 py-2 rounded transition-colors ${(categoryId || "") === category.id ? "text-white bg-blue-500" : "text-gray-600 dark:text-gray-300 hover:text-white hover:bg-gray-700 dark:hover:bg-gray-700"}`,
              children: category.name
            },
            category.id
          )) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-4  border border-gray-200 dark:border-gray-700 transition-colors duration-300", children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-gray-900 dark:text-white font-bold text-lg mb-4 flex items-center", children: [
            /* @__PURE__ */ jsx("svg", { className: "h-5 w-5 mr-2 text-blue-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" }) }),
            "📊 分类统计"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded", children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-600 dark:text-gray-300 text-sm", children: "当前分类" }),
              /* @__PURE__ */ jsx("span", { className: "text-blue-500 font-bold", children: currentCategory?.name || "全部" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded", children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-600 dark:text-gray-300 text-sm", children: "书籍总数" }),
              /* @__PURE__ */ jsxs("span", { className: "text-green-500 font-bold", children: [
                pagination.total,
                " 本"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded", children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-600 dark:text-gray-300 text-sm", children: "当前页" }),
              /* @__PURE__ */ jsxs("span", { className: "text-purple-500 font-bold", children: [
                pagination.currentPage,
                " / ",
                pagination.totalPages
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 transition-colors duration-300", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-gray-900 dark:text-white font-bold text-lg mb-4", children: "⚡ 快捷操作" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Button, { block: true, className: "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white", children: "📚 我的书架" }),
            /* @__PURE__ */ jsx(Button, { block: true, className: "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white", children: "🔖 收藏夹" }),
            /* @__PURE__ */ jsx(Button, { block: true, className: "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white", children: "📊 阅读统计" }),
            /* @__PURE__ */ jsx(Link, { to: "/", children: /* @__PURE__ */ jsx(Button, { block: true, className: "bg-blue-500 hover:bg-blue-600 border-0 text-white", children: "🏠 返回首页" }) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("main", { className: "flex-1", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 mb-6 text-white transition-colors duration-300", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("h1", { className: "text-3xl font-bold mb-2", children: [
              "📚 ",
              currentCategory?.name || "全部分类"
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-lg opacity-90", children: "发现更多精彩内容 · 尽在夜读小说网" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold", children: pagination.total }),
            /* @__PURE__ */ jsx("div", { className: "text-sm opacity-90", children: "本精品" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-6  border border-gray-200 dark:border-gray-700 transition-colors duration-300", children: bookRows.length > 0 ? /* @__PURE__ */ jsx("div", { className: "space-y-2", children: bookRows.map((row, rowIndex) => /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: row.map((book) => /* @__PURE__ */ jsx(
            BookCard,
            {
              book,
              layout: "pc"
            },
            book.id
          )) }),
          rowIndex < bookRows.length - 1 && /* @__PURE__ */ jsx("div", { className: "border-b border-gray-200 dark:border-gray-600" })
        ] }, rowIndex)) }) : (
          /* 空状态显示 */
          /* @__PURE__ */ jsx("div", { className: "w-full", children: /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
            /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx("svg", { className: "h-8 w-8 text-gray-400 dark:text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" }) }) }),
            /* @__PURE__ */ jsx("h4", { className: "text-gray-400 dark:text-gray-400 font-medium mb-2", children: "暂无书籍" }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-500 dark:text-gray-500 text-sm", children: "该分类下暂时没有书籍，敬请期待更多精彩内容！" })
          ] }) })
        ) }),
        pagination.totalPages > 1 && /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between mb-4", children: /* @__PURE__ */ jsxs("div", { className: "text-gray-600 dark:text-gray-300 text-sm", children: [
            "显示第 ",
            (pagination.currentPage - 1) * pagination.pageSize + 1,
            " - ",
            Math.min(pagination.currentPage * pagination.pageSize, pagination.total),
            " 条，共 ",
            pagination.total,
            " 条记录"
          ] }) }),
          /* @__PURE__ */ jsx(
            Pagination,
            {
              value: pagination.currentPage,
              onChange: onPageChange,
              totalItems: pagination.total,
              itemsPerPage: pagination.pageSize,
              showPageSize: 5,
              forceEllipses: true,
              className: "custom-pagination [&_.rv-pagination]:text-gray-600 dark:[&_.rv-pagination]:text-gray-300 [&_.rv-pagination__item]:bg-gray-100 dark:[&_.rv-pagination__item]:bg-gray-700 [&_.rv-pagination__item:hover]:bg-gray-200 dark:[&_.rv-pagination__item:hover]:bg-gray-600 [&_.rv-pagination__item--active]:bg-blue-500",
              prevText: "上一页",
              nextText: "下一页"
            }
          )
        ] })
      ] })
    ] }) }),
    isLoading && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-8 text-center shadow-2xl transition-colors duration-300", children: [
      /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4" }),
      /* @__PURE__ */ jsx("div", { className: "text-gray-900 dark:text-white text-lg font-bold", children: "正在加载书籍数据..." }),
      /* @__PURE__ */ jsx("div", { className: "text-gray-400 dark:text-gray-400 text-sm", children: "请稍候，好书即将呈现" })
    ] }) }),
    error && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-8 text-center shadow-2xl max-w-md transition-colors duration-300", children: [
      /* @__PURE__ */ jsx("div", { className: "text-6xl mb-4", children: "😵" }),
      /* @__PURE__ */ jsx("h3", { className: "text-gray-900 dark:text-white text-xl font-bold mb-4", children: "加载失败" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-400 dark:text-gray-400 mb-6", children: error instanceof Error ? error.message : "网络连接出现问题" }),
      /* @__PURE__ */ jsx(
        Button,
        {
          onClick: () => window.location.reload(),
          className: "bg-blue-500 hover:bg-blue-600 border-0",
          children: "🔄 重新加载"
        }
      )
    ] }) })
  ] });
}

function Mobile$2({
  categories,
  currentCategory,
  books,
  pagination,
  isLoading,
  error,
  onPageChange
}) {
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const { categoryId } = useParams();
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300", children: [
    /* @__PURE__ */ jsx("nav", { className: "bg-white dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200 sticky top-0 z-50 transition-colors duration-300", children: /* @__PURE__ */ jsx("div", { className: "px-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-3", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsx("div", { className: "w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx(BookOpen, { className: "h-5 w-5 text-white" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-lg font-bold text-gray-900 dark:text-white", children: "分类浏览" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 dark:text-gray-400", children: "发现更多精彩 · 精品小说" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-2", children: /* @__PURE__ */ jsx(
        "button",
        {
          className: "p-2 text-gray-600 dark:text-gray-400 hover:text-white hover:bg-gray-700 dark:hover:bg-gray-700 rounded-lg transition-colors",
          onClick: () => setShowCategorySelector(!showCategorySelector),
          children: /* @__PURE__ */ jsx(MoreHorizontal, { className: "h-5 w-5" })
        }
      ) })
    ] }) }) }),
    showCategorySelector && /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-50", children: [
      /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/50", onClick: () => setShowCategorySelector(false) }),
      /* @__PURE__ */ jsx("div", { className: "fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-lg max-h-[60vh] overflow-y-auto", children: /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-gray-900 dark:text-white font-bold text-lg", children: "选择分类" }),
          /* @__PURE__ */ jsx("button", { onClick: () => setShowCategorySelector(false), children: /* @__PURE__ */ jsx(X, { className: "h-5 w-5 text-gray-400" }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-3", children: categories && categories.map((category) => /* @__PURE__ */ jsx(
          Link,
          {
            to: category.id === "" ? "/category" : `/category/${category.id}`,
            className: `p-3 rounded-lg text-center transition-colors block ${(categoryId || "") === category.id ? "bg-blue-500 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"}`,
            children: category.name
          },
          category.id
        )) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "px-4 py-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxs("h2", { className: "text-2xl font-bold text-gray-900 dark:text-white mb-2", children: [
              "📚 ",
              currentCategory?.name || "分类浏览"
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-600 dark:text-gray-300 text-sm mb-4", children: "发现精彩小说 · 沉浸式阅读体验" }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4 text-xs text-gray-400 dark:text-gray-400", children: [
              /* @__PURE__ */ jsxs("span", { children: [
                "📚 当前: ",
                /* @__PURE__ */ jsx("span", { className: "text-gray-900 dark:text-white font-bold", children: currentCategory?.name || "全部" })
              ] }),
              /* @__PURE__ */ jsxs("span", { children: [
                "📊 总数: ",
                /* @__PURE__ */ jsx("span", { className: "text-gray-900 dark:text-white font-bold", children: pagination.total })
              ] }),
              /* @__PURE__ */ jsxs("span", { children: [
                "📄 页码: ",
                /* @__PURE__ */ jsx("span", { className: "text-gray-900 dark:text-white font-bold", children: pagination.currentPage })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "text-right", children: /* @__PURE__ */ jsx("div", { className: "bg-blue-500 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-600 cursor-pointer transition-colors", children: "🔥 精选" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              block: true,
              type: "primary",
              className: "bg-blue-500 hover:bg-blue-600 border-0 h-10 text-white text-sm",
              children: "🔍 搜索小说"
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              block: true,
              className: "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white h-10 text-sm",
              children: "📚 查看书架"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-gray-900 dark:text-white font-bold text-lg", children: [
            "✨ ",
            currentCategory?.name || "分类",
            " 书籍"
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "text-sm text-gray-400 dark:text-gray-400", children: [
            pagination.total,
            " 本"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
          /* @__PURE__ */ jsxs(Button, { size: "small", className: "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white", children: [
            /* @__PURE__ */ jsx(Award, { className: "h-4 w-4 mr-1" }),
            "最新"
          ] }),
          /* @__PURE__ */ jsxs(Button, { size: "small", className: "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white", children: [
            /* @__PURE__ */ jsx(TrendingUp, { className: "h-4 w-4 mr-1" }),
            "热门"
          ] }),
          /* @__PURE__ */ jsxs(Button, { size: "small", className: "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white", children: [
            /* @__PURE__ */ jsx(Heart, { className: "h-4 w-4 mr-1" }),
            "收藏"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        books.map((book, index) => /* @__PURE__ */ jsx(
          BookCard,
          {
            book,
            layout: "mobile",
            showRank: true,
            rank: index,
            truncateLength: 80
          },
          book.id
        )),
        books.length === 0 && !isLoading && /* @__PURE__ */ jsx(Card, { className: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300", children: /* @__PURE__ */ jsxs("div", { className: "p-8 text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx(BookOpen, { className: "h-8 w-8 text-gray-400 dark:text-gray-400" }) }),
          /* @__PURE__ */ jsx("h4", { className: "text-gray-400 dark:text-gray-400 font-medium mb-2", children: "暂无书籍" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-500 dark:text-gray-500 text-sm", children: "该分类下暂时没有书籍，敬请期待更多精彩内容！" })
        ] }) })
      ] }),
      pagination.totalPages > 1 && /* @__PURE__ */ jsx(Card, { className: "mt-6 mb-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300", children: /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-gray-600 dark:text-gray-300 text-sm", children: [
            "第 ",
            pagination.currentPage,
            " 页 / 共 ",
            pagination.totalPages,
            " 页"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                size: "small",
                disabled: pagination.currentPage === 1,
                onClick: () => onPageChange(pagination.currentPage - 1),
                className: "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white disabled:opacity-50",
                children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "px-3 py-1 bg-blue-500 text-white rounded text-sm font-bold", children: pagination.currentPage }),
            /* @__PURE__ */ jsx(
              Button,
              {
                size: "small",
                disabled: pagination.currentPage === pagination.totalPages,
                onClick: () => onPageChange(pagination.currentPage + 1),
                className: "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white disabled:opacity-50",
                children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-3 pt-3 border-t border-gray-200 dark:border-gray-700", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-5 gap-2", children: Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
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
          return /* @__PURE__ */ jsx(
            Button,
            {
              size: "small",
              type: pagination.currentPage === pageNum ? "primary" : "default",
              onClick: () => onPageChange(pageNum),
              className: pagination.currentPage === pageNum ? "bg-blue-500 border-0" : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white",
              children: pageNum
            },
            pageNum
          );
        }) }) })
      ] }) }),
      /* @__PURE__ */ jsx(Card, { className: "mb-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300", children: /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
        /* @__PURE__ */ jsx("h4", { className: "text-gray-900 dark:text-white font-bold text-lg mb-4", children: "⚡ 快捷功能" }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition-colors", children: [
            /* @__PURE__ */ jsx(BookOpen, { className: "h-6 w-6 mx-auto mb-2 text-blue-500" }),
            /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-600 dark:text-gray-300", children: "我的书架" })
          ] }),
          /* @__PURE__ */ jsxs(Link, { to: "/", className: "text-center p-3 bg-blue-50 dark:bg-blue-900 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 cursor-pointer transition-colors", children: [
            /* @__PURE__ */ jsx(Crown, { className: "h-6 w-6 mx-auto mb-2 text-blue-500" }),
            /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-600 dark:text-gray-300", children: "返回首页" })
          ] })
        ] })
      ] }) }),
      isLoading && /* @__PURE__ */ jsx(Card, { className: "mt-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300", children: /* @__PURE__ */ jsx("div", { className: "p-8 text-center", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center", children: [
        /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mr-3" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "font-medium text-gray-900 dark:text-white", children: "正在加载书籍数据..." }),
          /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-400 dark:text-gray-400", children: "请稍候" })
        ] })
      ] }) }) }),
      error && /* @__PURE__ */ jsx(Card, { className: "mt-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300", children: /* @__PURE__ */ jsxs("div", { className: "p-8 text-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-blue-400 mb-4", children: [
          /* @__PURE__ */ jsx("div", { className: "text-4xl mb-2", children: "😵" }),
          /* @__PURE__ */ jsx("div", { className: "font-medium text-gray-900 dark:text-white", children: "加载失败" }),
          /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-400 dark:text-gray-400", children: error instanceof Error ? error.message : "未知错误" })
        ] }),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "primary",
            size: "small",
            className: "bg-blue-500 hover:bg-blue-600 border-0",
            onClick: () => window.location.reload(),
            children: "🔄 重新加载"
          }
        )
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("footer", { className: "bg-gray-800 dark:bg-gray-800 border-t border-gray-700 dark:border-gray-700 py-6 mt-8 transition-colors duration-300", children: /* @__PURE__ */ jsxs("div", { className: "px-4 text-center", children: [
      /* @__PURE__ */ jsx("h4", { className: "font-bold text-white mb-3 text-lg", children: "📚 分类浏览" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400 dark:text-gray-400 mb-4", children: "探索更多精彩分类 · 发现优质小说" }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-center space-x-4 text-sm text-gray-500 dark:text-gray-500 mb-4", children: [
        /* @__PURE__ */ jsxs("span", { className: "flex items-center", children: [
          /* @__PURE__ */ jsx(Award, { className: "h-4 w-4 mr-1 text-blue-500" }),
          "品质"
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "flex items-center", children: [
          /* @__PURE__ */ jsx(TrendingUp, { className: "h-4 w-4 mr-1 text-green-500" }),
          "更新"
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "flex items-center", children: [
          /* @__PURE__ */ jsx(Heart, { className: "h-4 w-4 mr-1 text-purple-500" }),
          "推荐"
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "border-t border-gray-700 dark:border-gray-700 pt-4", children: /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 dark:text-gray-500", children: "© 2025 夜读小说网 · 专业的在线阅读平台" }) })
    ] }) })
  ] });
}

const baseUrl$2 = undefined                            ;
const imgHost$2 = undefined                            ;
async function fetchCategories() {
  try {
    const response = await fetch(baseUrl$2, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        sql: `SELECT 
          id,
          name,
          "createTime",
          "updateTime",
          "deleteFlag"
        FROM public.category
        WHERE "deleteFlag" = false
        ORDER BY "createTime" DESC`
      })
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || "获取分类数据失败");
    }
    return result.data || [];
  } catch (error) {
    console.error("获取分类数据失败:", error);
    throw error;
  }
}
async function fetchCategoryBooks(params) {
  try {
    const {
      categoryId,
      page,
      pageSize
    } = params;
    const offset = (page - 1) * pageSize;
    let sqlCondition = "";
    if (categoryId && categoryId !== "''") {
      sqlCondition = `WHERE b."categoryId" = '${categoryId}' AND b."deleteFlag" = false AND b."isShow" = true`;
    } else {
      sqlCondition = `WHERE b."deleteFlag" = false AND b."isShow" = true`;
    }
    const [booksResponse, countResponse] = await Promise.all([fetch(baseUrl$2, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        sql: `SELECT 
            b.id,
            b."name",
            b."desc",
            b."bookImage",
            b."status",
            b."fired",
            b."lastChapter",
            a."name" as "author",
            b."authorId" as "authorId"
          FROM public.book b
          LEFT JOIN public.author a ON b."authorId" = a.id
          ${sqlCondition}
          ORDER BY b."createTime" DESC
          LIMIT ${pageSize} OFFSET ${offset}`
      })
    }), fetch(baseUrl$2, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        sql: `SELECT COUNT(*) as total
          FROM public.book b
          ${sqlCondition}`
      })
    })]);
    if (!booksResponse.ok || !countResponse.ok) {
      throw new Error(`HTTP error! books: ${booksResponse.status}, count: ${countResponse.status}`);
    }
    const booksResult = await booksResponse.json();
    const countResult = await countResponse.json();
    if (!booksResult.success) {
      throw new Error(booksResult.message || "获取书籍数据失败");
    }
    if (!countResult.success) {
      throw new Error(countResult.message || "获取统计数据失败");
    }
    const processedBooks = booksResult.data?.map((book) => ({
      ...book,
      bookImage: book.bookImage ? `${imgHost$2}${book.bookImage}` : void 0
    })) || [];
    const total = countResult.data?.[0]?.total || 0;
    return {
      books: processedBooks,
      total
    };
  } catch (error) {
    console.error("获取分类书籍数据失败:", error);
    throw error;
  }
}
function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1e3
    // 5分钟缓存
  });
}
function useCategoryBooks(categoryId, page, pageSize) {
  return useQuery({
    queryKey: ["categoryBooks", categoryId, page],
    queryFn: () => fetchCategoryBooks({
      categoryId: categoryId || "",
      page,
      pageSize
    }),
    staleTime: 2 * 60 * 1e3,
    // 2分钟缓存
    refetchOnWindowFocus: false,
    refetchOnMount: "always"
  });
}
function formatHeat$2(fired) {
  if (fired >= 1e4) {
    return `🔥 ${(fired / 1e4).toFixed(1)}万`;
  } else if (fired >= 1e3) {
    return `🔥 ${(fired / 1e3).toFixed(1)}千`;
  } else {
    return `🔥 ${fired}`;
  }
}
const index$2 = UNSAFE_withComponentProps(function Category() {
  const {
    categoryId
  } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;
  useQueryClient();
  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError
  } = useCategories();
  const {
    data: booksData,
    isLoading: booksLoading,
    error: booksError
  } = useCategoryBooks(categoryId || null, currentPage, pageSize);
  const pagination = useMemo(() => {
    const total = booksData?.total || 0;
    const totalPages = Math.ceil(total / pageSize);
    return {
      currentPage,
      pageSize,
      total,
      totalPages
    };
  }, [booksData?.total, currentPage, pageSize]);
  const currentCategory = useMemo(() => {
    if (categoryId === "" || categoryId === void 0) {
      return {
        id: "''",
        name: "全部",
        createTime: /* @__PURE__ */ new Date(),
        updateTime: /* @__PURE__ */ new Date(),
        deleteFlag: false
      };
    }
    return categories?.find((cat) => cat.id === categoryId);
  }, [categories, categoryId]);
  const allCategory = {
    id: "",
    name: "全部",
    createTime: /* @__PURE__ */ new Date(),
    updateTime: /* @__PURE__ */ new Date(),
    deleteFlag: false
  };
  const categoriesWithAll = [allCategory, ...categories || []];
  const isLoading = categoriesLoading || booksLoading;
  const error = categoriesError || booksError;
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };
  return /* @__PURE__ */ jsx("div", {
    className: "min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300",
    children: isMobile ? /* @__PURE__ */ jsx(Mobile$2, {
      categories: categoriesWithAll,
      currentCategory,
      books: booksData?.books || [],
      pagination,
      isLoading,
      error,
      onPageChange: handlePageChange
    }) : /* @__PURE__ */ jsx(PC$2, {
      categories: categoriesWithAll,
      currentCategory,
      books: booksData?.books || [],
      pagination,
      isLoading,
      error,
      onPageChange: handlePageChange
    })
  });
});

const route3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index$2,
  formatHeat: formatHeat$2,
  useCategories,
  useCategoryBooks
}, Symbol.toStringTag, { value: 'Module' }));

function PC$1({
  authorDetail,
  isLoading,
  error
}) {
  const truncateDesc = (desc) => {
    if (!desc) return "";
    return desc.length > 100 ? desc.substring(0, 100) + "..." : desc;
  };
  const totalBooks = authorDetail?.totalBooks || 0;
  const totalFired = authorDetail?.totalFired || 0;
  const getBooksPerRow = () => {
    const containerWidth = 1200 - 48;
    const cardWidth = 440;
    const gap = 8;
    const booksPerRow = Math.max(1, Math.floor(containerWidth / (cardWidth + gap)));
    return booksPerRow;
  };
  const getBooksByRow = () => {
    if (!authorDetail?.books || authorDetail.books.length === 0) return [];
    const booksPerRow = getBooksPerRow();
    const rows = [];
    for (let i = 0; i < authorDetail.books.length; i += booksPerRow) {
      rows.push(authorDetail.books.slice(i, i + booksPerRow));
    }
    return rows;
  };
  const bookRows = getBooksByRow();
  const renderBookCard = (book) => /* @__PURE__ */ jsx(Link, { to: `/book/${book.id}`, children: /* @__PURE__ */ jsx("div", { className: "relative flex-shrink-0", children: /* @__PURE__ */ jsx(Card, { className: "bg-gray-50 w-full h-45 p-0 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 hover:shadow-lg", children: /* @__PURE__ */ jsx(Card.Body, { className: "py-0!", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
    /* @__PURE__ */ jsx("div", { className: "w-32 h-40 flex-shrink-0", children: book.bookImage && /* @__PURE__ */ jsx(
      "img",
      {
        src: book.bookImage,
        alt: book.name,
        className: "w-full h-full object-cover rounded"
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-3 p-4 relative", children: [
      /* @__PURE__ */ jsx("h4", { className: "text-gray-900 dark:text-white font-bold text-lg leading-tight", children: book.name }),
      /* @__PURE__ */ jsx("div", { className: "pt-2 absolute top-10 right-2", children: /* @__PURE__ */ jsx("span", { className: `${book.status.includes("连载") ? "bg-blue-500" : "bg-gray-500"} text-white px-3 py-1 rounded-full text-sm font-medium`, children: book.status }) }),
      book.category && /* @__PURE__ */ jsx(Link, { to: `/category/${book.categoryId}`, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center text-sm text-gray-500 dark:text-gray-400", children: [
        /* @__PURE__ */ jsx("svg", { className: "h-4 w-4 mr-1", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a1.994 1.994 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" }) }),
        /* @__PURE__ */ jsx("span", { className: "truncate", children: book.category })
      ] }) }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 dark:text-gray-300 text-sm line-clamp-2 leading-relaxed", children: truncateDesc(book.desc) }),
      /* @__PURE__ */ jsx("div", { className: "space-y-1", children: /* @__PURE__ */ jsxs("div", { className: "text-xs text-gray-500 dark:text-gray-400", children: [
        "热度: ",
        /* @__PURE__ */ jsx("span", { className: "text-red-500 font-bold", children: formatHeat$1(book.fired) })
      ] }) })
    ] })
  ] }) }) }) }, book.id) });
  if (error) {
    return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300", children: [
      /* @__PURE__ */ jsx(Navbar, {}),
      /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto pt-6 py-6", children: /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-8 text-center border border-gray-200 dark:border-gray-700 transition-colors duration-300", children: [
        /* @__PURE__ */ jsx("div", { className: "text-6xl mb-4", children: "😵" }),
        /* @__PURE__ */ jsx("h3", { className: "text-gray-900 dark:text-white text-xl font-bold mb-4", children: "加载失败" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-400 dark:text-gray-400 mb-6", children: error.message }),
        /* @__PURE__ */ jsx(
          Button,
          {
            onClick: () => window.location.reload(),
            className: "bg-blue-500 hover:bg-blue-600 border-0",
            children: "🔄 重新加载"
          }
        )
      ] }) })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto pt-6 py-6", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-6", children: [
      /* @__PURE__ */ jsxs("aside", { className: "w-64 flex-shrink-0 flex gap-2 flex-col", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 transition-colors duration-300", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-gray-900 dark:text-white font-bold text-lg", children: "👨‍💼 作者信息" }),
            /* @__PURE__ */ jsx("svg", { className: "h-4 w-4 text-gray-400 dark:text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" }) })
          ] }),
          authorDetail?.author && /* @__PURE__ */ jsx("div", { className: "space-y-3", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3", children: /* @__PURE__ */ jsx("span", { className: "text-white font-bold text-2xl", children: authorDetail.author.name.charAt(0) }) }),
            /* @__PURE__ */ jsx("h4", { className: "text-gray-900 dark:text-white font-bold text-lg", children: authorDetail.author.name }),
            /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: [
              "入驻时间: ",
              formatDate(authorDetail.author.createTime)
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 transition-colors duration-300", children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-gray-900 dark:text-white font-bold text-lg mb-4 flex items-center", children: [
            /* @__PURE__ */ jsx("svg", { className: "h-5 w-5 mr-2 text-blue-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" }) }),
            "📊 作品统计"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded", children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-600 dark:text-gray-300 text-sm", children: "作品总数" }),
              /* @__PURE__ */ jsxs("span", { className: "text-blue-500 font-bold", children: [
                totalBooks,
                " 部"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded", children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-600 dark:text-gray-300 text-sm", children: "总热度" }),
              /* @__PURE__ */ jsx("span", { className: "text-red-500 font-bold", children: formatHeat$1(totalFired) })
            ] }),
            authorDetail?.latestUpdate && /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded", children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-600 dark:text-gray-300 text-sm", children: "最新更新" }),
              /* @__PURE__ */ jsx("span", { className: "text-green-500 font-bold text-sm", children: formatDate(authorDetail.latestUpdate) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 transition-colors duration-300", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-gray-900 dark:text-white font-bold text-lg mb-4", children: "⚡ 快捷操作" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Button, { block: true, className: "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white", children: "📚 我的书架" }),
            /* @__PURE__ */ jsx(Button, { block: true, className: "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white", children: "🔖 收藏夹" }),
            /* @__PURE__ */ jsx(Button, { block: true, className: "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white", children: "📊 阅读统计" }),
            /* @__PURE__ */ jsx(Link, { to: "/", children: /* @__PURE__ */ jsx(Button, { block: true, className: "bg-blue-500 hover:bg-blue-600 border-0 text-white", children: "🏠 返回首页" }) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("main", { className: "flex-1", children: /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-gray-900 dark:text-white font-bold text-xl", children: [
            "📚 ",
            authorDetail?.author.name || "作者",
            " 的作品"
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "text-sm text-gray-400 dark:text-gray-400", children: [
            "共 ",
            totalBooks,
            " 部作品"
          ] })
        ] }),
        bookRows.length > 0 ? /* @__PURE__ */ jsx("div", { className: "space-y-2", children: bookRows.map((row, rowIndex) => /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: row.map(renderBookCard) }),
          rowIndex < bookRows.length - 1 && /* @__PURE__ */ jsx("div", { className: "border-b border-gray-200 dark:border-gray-600 my-4" })
        ] }, rowIndex)) }) : (
          /* 空状态显示 */
          /* @__PURE__ */ jsx("div", { className: "w-full", children: /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
            /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx("svg", { className: "h-8 w-8 text-gray-400 dark:text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" }) }) }),
            /* @__PURE__ */ jsx("h4", { className: "text-gray-400 dark:text-gray-400 font-medium mb-2", children: "暂无作品" }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-500 dark:text-gray-500 text-sm", children: "该作者暂时没有公开作品，敬请期待更多精彩内容！" })
          ] }) })
        )
      ] }) })
    ] }) }),
    isLoading && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-8 text-center shadow-2xl transition-colors duration-300", children: [
      /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4" }),
      /* @__PURE__ */ jsx("div", { className: "text-gray-900 dark:text-white text-lg font-bold", children: "正在加载作者信息..." }),
      /* @__PURE__ */ jsx("div", { className: "text-gray-400 dark:text-gray-400 text-sm", children: "请稍候，精彩内容即将呈现" })
    ] }) })
  ] });
}

function Mobile$1({
  authorDetail,
  isLoading,
  error
}) {
  const { authorId } = useParams();
  const truncateDesc = (desc) => {
    if (!desc) return "";
    return desc.length > 80 ? desc.substring(0, 80) + "..." : desc;
  };
  const totalBooks = authorDetail?.totalBooks || 0;
  const totalFired = authorDetail?.totalFired || 0;
  if (error) {
    return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300", children: [
      /* @__PURE__ */ jsx("nav", { className: "bg-white dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200 sticky top-0 z-50 transition-colors duration-300", children: /* @__PURE__ */ jsx("div", { className: "px-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-3", children: [
        /* @__PURE__ */ jsxs(Link, { to: "/", className: "flex items-center text-gray-600 dark:text-gray-400", children: [
          /* @__PURE__ */ jsx(ArrowLeft, { className: "h-5 w-5 mr-1" }),
          "返回"
        ] }),
        /* @__PURE__ */ jsx("h1", { className: "text-lg font-bold text-gray-900 dark:text-white", children: "作者信息" }),
        /* @__PURE__ */ jsx("div", { className: "w-12" }),
        " "
      ] }) }) }),
      /* @__PURE__ */ jsx("div", { className: "px-4 py-4", children: /* @__PURE__ */ jsx(Card, { className: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300", children: /* @__PURE__ */ jsxs("div", { className: "p-8 text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "text-4xl mb-4", children: "😵" }),
        /* @__PURE__ */ jsx("h4", { className: "text-gray-900 dark:text-white font-medium mb-2", children: "加载失败" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-500 dark:text-gray-500 text-sm mb-4", children: error.message }),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "primary",
            size: "small",
            className: "bg-blue-500 hover:bg-blue-600 border-0",
            onClick: () => window.location.reload(),
            children: "🔄 重新加载"
          }
        )
      ] }) }) })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300", children: [
    /* @__PURE__ */ jsx("nav", { className: "bg-white dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200 sticky top-0 z-50 transition-colors duration-300", children: /* @__PURE__ */ jsx("div", { className: "px-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-3", children: [
      /* @__PURE__ */ jsxs(Link, { to: "/", className: "flex items-center text-gray-600 dark:text-gray-400 hover:text-white hover:bg-gray-700 dark:hover:bg-gray-700 rounded-lg transition-colors px-2 py-1", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "h-5 w-5 mr-1" }),
        "返回"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsx("div", { className: "w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx(User, { className: "h-5 w-5 text-white" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-lg font-bold text-gray-900 dark:text-white", children: "作者页面" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 dark:text-gray-400", children: "精彩作品一览" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "w-12" }),
      " "
    ] }) }) }),
    /* @__PURE__ */ jsxs("div", { className: "px-4 py-4", children: [
      /* @__PURE__ */ jsx(Card, { className: "mb-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300", children: /* @__PURE__ */ jsx(Card.Body, { className: "p-6", children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between mb-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4", children: [
        /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx("span", { className: "text-white font-bold text-2xl", children: authorDetail?.author.name?.charAt(0) || "作" }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxs("h2", { className: "text-xl font-bold text-gray-900 dark:text-white mb-1", children: [
            "📝 ",
            authorDetail?.author.name || "作者"
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-gray-600 dark:text-gray-300 text-sm mb-2", children: [
            "入驻时间: ",
            authorDetail?.author.createTime ? formatDate(authorDetail.author.createTime) : "-"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4 text-xs text-gray-400 dark:text-gray-400", children: [
            /* @__PURE__ */ jsxs("span", { children: [
              "📚 作品: ",
              /* @__PURE__ */ jsx("span", { className: "text-gray-900 dark:text-white font-bold", children: totalBooks })
            ] }),
            /* @__PURE__ */ jsxs("span", { children: [
              "🔥 热度: ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500 font-bold", children: formatHeat$1(totalFired) })
            ] })
          ] })
        ] })
      ] }) }) }) }),
      /* @__PURE__ */ jsx(Card, { className: "mb-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300", children: /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-gray-900 dark:text-white font-bold text-lg mb-4", children: "⚡ 快捷操作" }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              block: true,
              type: "primary",
              className: "bg-blue-500 hover:bg-blue-600 border-0 h-10 text-white text-sm",
              children: "📚 我的书架"
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              block: true,
              className: "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white h-10 text-sm",
              children: "🔖 收藏夹"
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 border border-gray-200 dark:border-gray-700 transition-colors duration-300", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-gray-900 dark:text-white font-bold text-lg", children: [
          "✨ ",
          authorDetail?.author.name || "作者",
          " 的作品"
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "text-sm text-gray-400 dark:text-gray-400", children: [
          totalBooks,
          " 部"
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        authorDetail?.books.map((book, index) => /* @__PURE__ */ jsx(Card, { className: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-all duration-200 hover:shadow-lg", children: /* @__PURE__ */ jsx(Card.Body, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex space-x-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative flex-shrink-0", children: [
            book.bookImage && /* @__PURE__ */ jsx(
              "img",
              {
                src: book.bookImage,
                alt: book.name,
                className: "w-20 h-28 object-cover rounded",
                onError: (e) => {
                  const target = e.target;
                  target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDIwMCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NiA2NEw5MCA3Nkw5NCA2NEgxMTBMMTMyIDEyOEwxMDggMTQ0SDkwSDEwOEw5NCAxMTZMMTAwIDEwOEw5NiA5Nkg4NlpNMTI0IDExMkwxMjggMTIwUTEyNiAxMzAgMTIyIDEzMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+";
                }
              }
            ),
            index < 3 && /* @__PURE__ */ jsx("div", { className: "absolute -top-1 -left-1", children: /* @__PURE__ */ jsxs("div", { className: `${index === 0 ? "bg-blue-500" : index === 1 ? "bg-indigo-500" : "bg-purple-500"} text-white px-2 py-1 rounded text-xs font-bold flex items-center`, children: [
              index === 0 ? "👑" : index === 1 ? "🥈" : "🥉",
              " TOP",
              index + 1
            ] }) }),
            /* @__PURE__ */ jsx("div", { className: "absolute -bottom-1 -right-1", children: /* @__PURE__ */ jsx("span", { className: `${book.status.includes("连载") ? "bg-green-500" : "bg-blue-500"} text-white px-2 py-1 rounded text-xs font-bold`, children: book.status }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsx("h4", { className: "text-gray-900 dark:text-white font-bold text-base mb-2 line-clamp-2 leading-tight", children: book.name }),
              book.category && /* @__PURE__ */ jsxs("div", { className: "flex items-center text-sm text-gray-400 dark:text-gray-400 mb-2", children: [
                /* @__PURE__ */ jsx("svg", { className: "h-4 w-4 mr-1", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a1.994 1.994 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" }) }),
                /* @__PURE__ */ jsx("span", { className: "truncate", children: book.category })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2", children: truncateDesc(book.desc) }),
              book.lastChapter && /* @__PURE__ */ jsx("div", { className: "mb-3 p-2 bg-gray-100 dark:bg-gray-600 rounded text-sm", children: /* @__PURE__ */ jsxs("div", { className: "text-gray-600 dark:text-gray-300", children: [
                "📖 最新: ",
                book.lastChapter
              ] }) }),
              book.fired && /* @__PURE__ */ jsx("div", { className: "mb-3", children: /* @__PURE__ */ jsx("span", { className: "bg-red-500 text-white px-2 py-1 rounded text-xs font-bold", children: formatHeat$1(book.fired) }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex-shrink-0 ml-3 flex flex-col items-end space-y-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-1", children: [
                /* @__PURE__ */ jsx(Star, { className: "h-4 w-4 text-yellow-500" }),
                /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-400 dark:text-gray-400", children: "9.2" })
              ] }),
              /* @__PURE__ */ jsx(Link, { to: `/book/${book.id}`, children: /* @__PURE__ */ jsx(
                Button,
                {
                  size: "small",
                  className: "bg-blue-500 hover:bg-blue-600 border-0 text-sm px-3 py-1 font-bold",
                  children: "📖 阅读"
                }
              ) })
            ] })
          ] }) })
        ] }) }) }, book.id)),
        (authorDetail?.books?.length || 0) === 0 && !isLoading && /* @__PURE__ */ jsx(Card, { className: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300", children: /* @__PURE__ */ jsxs("div", { className: "p-8 text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx(BookOpen, { className: "h-8 w-8 text-gray-400 dark:text-gray-400" }) }),
          /* @__PURE__ */ jsx("h4", { className: "text-gray-400 dark:text-gray-400 font-medium mb-2", children: "暂无作品" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-500 dark:text-gray-500 text-sm", children: "该作者暂时没有公开作品，敬请期待更多精彩内容！" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx(Card, { className: "mt-6 mb-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300", children: /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
        /* @__PURE__ */ jsx("h4", { className: "text-gray-900 dark:text-white font-bold text-lg mb-4", children: "📚 相关推荐" }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition-colors", children: [
            /* @__PURE__ */ jsx(BookOpen, { className: "h-6 w-6 mx-auto mb-2 text-blue-500" }),
            /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-600 dark:text-gray-300", children: "同类作者" })
          ] }),
          /* @__PURE__ */ jsxs(Link, { to: "/", className: "text-center p-3 bg-blue-50 dark:bg-blue-900 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 cursor-pointer transition-colors", children: [
            /* @__PURE__ */ jsx(Crown, { className: "h-6 w-6 mx-auto mb-2 text-blue-500" }),
            /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-600 dark:text-gray-300", children: "返回首页" })
          ] })
        ] })
      ] }) }),
      isLoading && /* @__PURE__ */ jsx(Card, { className: "mt-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300", children: /* @__PURE__ */ jsx("div", { className: "p-8 text-center", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center", children: [
        /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mr-3" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "font-medium text-gray-900 dark:text-white", children: "正在加载作者信息..." }),
          /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-400 dark:text-gray-400", children: "请稍候" })
        ] })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsx("footer", { className: "bg-gray-800 dark:bg-gray-800 border-t border-gray-700 dark:border-gray-700 py-6 mt-8 transition-colors duration-300", children: /* @__PURE__ */ jsxs("div", { className: "px-4 text-center", children: [
      /* @__PURE__ */ jsx("h4", { className: "font-bold text-white mb-3 text-lg", children: "📝 作者作品" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400 dark:text-gray-400 mb-4", children: "探索作者精彩世界 · 发现优质内容" }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-center space-x-4 text-sm text-gray-500 dark:text-gray-500 mb-4", children: [
        /* @__PURE__ */ jsxs("span", { className: "flex items-center", children: [
          /* @__PURE__ */ jsx(Award, { className: "h-4 w-4 mr-1 text-blue-500" }),
          "品质"
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "flex items-center", children: [
          /* @__PURE__ */ jsx(TrendingUp, { className: "h-4 w-4 mr-1 text-green-500" }),
          "更新"
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "flex items-center", children: [
          /* @__PURE__ */ jsx(Heart, { className: "h-4 w-4 mr-1 text-purple-500" }),
          "推荐"
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "border-t border-gray-700 dark:border-gray-700 pt-4", children: /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 dark:text-gray-500", children: "© 2025 夜读小说网 · 专业的在线阅读平台" }) })
    ] }) })
  ] });
}

const baseUrl$1 = undefined                            ;
const imgHost$1 = undefined                            ;
async function fetchAuthorDetail(authorId) {
  try {
    const response = await fetch(baseUrl$1, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        sql: `SELECT 
          a.id,
          a.name,
          a."isActive",
          a."createTime",
          a."updateTime",
          COALESCE(
            json_agg(
              CASE 
                WHEN b.id IS NOT NULL THEN 
                  json_build_object(
                    'id', b.id,
                    'name', b."name",
                    'desc', b."desc",
                    'bookImage', b."bookImage",
                    'status', b."status",
                    'fired', b."fired",
                    'lastChapter', b."lastChapter",
                    'updateTime', b."updateTime",
                    'category', c."name",
                    'categoryId',c."id"
                  )
                ELSE NULL
              END
              ORDER BY b."updateTime" DESC
            ) FILTER (WHERE b.id IS NOT NULL),
            '[]'::json
          ) as books
        FROM public.author a
        LEFT JOIN (
          SELECT *
          FROM public.book 
          WHERE "deleteFlag" = false AND "isShow" = true
        ) b ON a.id = b."authorId"
        LEFT JOIN public.category c ON b."categoryId" = c.id
        WHERE a.id = '${authorId}' AND a."deleteFlag" = false AND a."isActive" = true
        GROUP BY a.id, a.name, a."isActive", a."createTime", a."updateTime"`
      })
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || "获取作者数据失败");
    }
    const authorData = result.data?.[0];
    if (!authorData) {
      throw new Error("作者不存在或已被禁用");
    }
    const processedBooks = authorData.books?.map((book) => ({
      ...book,
      bookImage: book.bookImage ? `${imgHost$1}${book.bookImage}` : void 0,
      updateTime: new Date(book.updateTime)
    })) || [];
    const totalBooks = processedBooks.length;
    const totalFired = processedBooks.reduce((sum, book) => sum + book.fired, 0);
    const latestUpdate = processedBooks.length > 0 ? processedBooks.reduce((latest, book) => book.updateTime > latest ? book.updateTime : latest, processedBooks[0].updateTime) : void 0;
    return {
      author: {
        id: authorData.id,
        name: authorData.name,
        isActive: authorData.isActive,
        createTime: new Date(authorData.createTime),
        updateTime: new Date(authorData.updateTime),
        deleteFlag: false,
        books: []
      },
      books: processedBooks,
      totalBooks,
      totalFired,
      latestUpdate
    };
  } catch (error) {
    console.error("获取作者数据失败:", error);
    throw error;
  }
}
function useAuthorDetail(authorId) {
  return useQuery({
    queryKey: ["authorDetail", authorId],
    queryFn: () => fetchAuthorDetail(authorId),
    enabled: !!authorId
  });
}
function formatHeat$1(fired) {
  if (fired >= 1e4) {
    return `🔥 ${(fired / 1e4).toFixed(1)}万`;
  } else if (fired >= 1e3) {
    return `🔥 ${(fired / 1e3).toFixed(1)}千`;
  } else {
    return `🔥 ${fired}`;
  }
}
function formatDate(date) {
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}
const index$1 = UNSAFE_withComponentProps(function Author() {
  const {
    authorId
  } = useParams();
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const {
    data: authorDetail,
    isLoading,
    error
  } = useAuthorDetail(authorId || "");
  return /* @__PURE__ */ jsx("div", {
    className: "min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300",
    children: isMobile ? /* @__PURE__ */ jsx(Mobile$1, {
      authorDetail,
      isLoading,
      error
    }) : /* @__PURE__ */ jsx(PC$1, {
      authorDetail,
      isLoading,
      error
    })
  });
});

const route4 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index$1,
  formatDate,
  formatHeat: formatHeat$1,
  useAuthorDetail
}, Symbol.toStringTag, { value: 'Module' }));

function PC({
  specialConfig,
  books,
  pagination,
  isLoading,
  error,
  onPageChange
}) {
  const { type } = useParams();
  const getBooksPerRow = () => {
    const containerWidth = 1200 - 48;
    const cardWidth = 440;
    const gap = 8;
    const booksPerRow = Math.max(1, Math.floor(containerWidth / (cardWidth + gap)));
    return booksPerRow;
  };
  const getBooksByRow = () => {
    if (books.length === 0) return [];
    const booksPerRow = getBooksPerRow();
    const rows = [];
    for (let i = 0; i < books.length; i += booksPerRow) {
      rows.push(books.slice(i, i + booksPerRow));
    }
    return rows;
  };
  const bookRows = getBooksByRow();
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto pt-6 py-6", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-6", children: [
      /* @__PURE__ */ jsxs("aside", { className: "w-64 flex-shrink-0 flex gap-2 flex-col", children: [
        /* @__PURE__ */ jsx("div", { className: `${specialConfig.bgColor} rounded-lg p-6 text-white border-0 transition-colors duration-300`, children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "text-4xl mb-3", children: specialConfig.icon }),
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold mb-2", children: specialConfig.title }),
          /* @__PURE__ */ jsx("p", { className: "text-sm opacity-90", children: specialConfig.description })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 transition-colors duration-300", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-gray-900 dark:text-white font-bold text-lg mb-4", children: "📚 专题导航" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx(
              Link,
              {
                to: "/special/completed",
                className: `block cursor-pointer px-3 py-2 rounded transition-colors ${type === "completed" ? "text-white bg-purple-500" : "text-gray-600 dark:text-gray-300 hover:text-white hover:bg-gray-700 dark:hover:bg-gray-700"}`,
                children: "🏆 完结精品"
              }
            ),
            /* @__PURE__ */ jsx(
              Link,
              {
                to: "/special/new",
                className: `block cursor-pointer px-3 py-2 rounded transition-colors ${type === "new" ? "text-white bg-blue-500" : "text-gray-600 dark:text-gray-300 hover:text-white hover:bg-gray-700 dark:hover:bg-gray-700"}`,
                children: "✨ 最新上架"
              }
            ),
            /* @__PURE__ */ jsx(
              Link,
              {
                to: "/category/''",
                className: "block cursor-pointer px-3 py-2 rounded transition-colors text-gray-600 dark:text-gray-300 hover:text-white hover:bg-gray-700 dark:hover:bg-gray-700",
                children: "📖 全部分类"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 transition-colors duration-300", children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-gray-900 dark:text-white font-bold text-lg mb-4 flex items-center", children: [
            /* @__PURE__ */ jsx("svg", { className: "h-5 w-5 mr-2 text-blue-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" }) }),
            "📊 专题统计"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded", children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-600 dark:text-gray-300 text-sm", children: "当前专题" }),
              /* @__PURE__ */ jsx("span", { className: specialConfig.textColor.replace("text-", "text-") + " font-bold", children: specialConfig.title })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded", children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-600 dark:text-gray-300 text-sm", children: "书籍总数" }),
              /* @__PURE__ */ jsxs("span", { className: "text-green-500 font-bold", children: [
                pagination.total,
                " 本"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded", children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-600 dark:text-gray-300 text-sm", children: "当前页" }),
              /* @__PURE__ */ jsxs("span", { className: "text-purple-500 font-bold", children: [
                pagination.currentPage,
                " / ",
                pagination.totalPages
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 transition-colors duration-300", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-gray-900 dark:text-white font-bold text-lg mb-4", children: "⚡ 快捷操作" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Button, { block: true, className: "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white", children: "📚 我的书架" }),
            /* @__PURE__ */ jsx(Button, { block: true, className: "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white", children: "🔖 收藏夹" }),
            /* @__PURE__ */ jsx(Button, { block: true, className: "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white", children: "📊 阅读统计" }),
            /* @__PURE__ */ jsx(Link, { to: "/", children: /* @__PURE__ */ jsx(Button, { block: true, className: "bg-blue-500 hover:bg-blue-600 border-0 text-white", children: "🏠 返回首页" }) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("main", { className: "flex-1", children: [
        /* @__PURE__ */ jsx("div", { className: `${specialConfig.bgColor} rounded-lg p-6 mb-6 text-white transition-colors duration-300`, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("h1", { className: "text-3xl font-bold mb-2", children: [
              specialConfig.icon,
              " ",
              specialConfig.title
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-lg opacity-90", children: specialConfig.description })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold", children: pagination.total }),
            /* @__PURE__ */ jsx("div", { className: "text-sm opacity-90", children: "本精品" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300", children: bookRows.length > 0 ? /* @__PURE__ */ jsx("div", { className: "space-y-2", children: bookRows.map((row, rowIndex) => /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: row.map((book) => /* @__PURE__ */ jsx(
            BookCard,
            {
              book,
              layout: "pc"
            },
            book.id
          )) }),
          rowIndex < bookRows.length - 1 && /* @__PURE__ */ jsx("div", { className: "border-b border-gray-200 dark:border-gray-600" })
        ] }, rowIndex)) }) : (
          /* 空状态显示 */
          /* @__PURE__ */ jsx("div", { className: "w-full", children: /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
            /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx("span", { className: "text-3xl", children: specialConfig.icon }) }),
            /* @__PURE__ */ jsx("h4", { className: "text-gray-400 dark:text-gray-400 font-medium mb-2", children: "暂无书籍" }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-500 dark:text-gray-500 text-sm", children: "该专题下暂时没有书籍，敬请期待更多精彩内容！" })
          ] }) })
        ) }),
        pagination.totalPages > 1 && /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between mb-4", children: /* @__PURE__ */ jsxs("div", { className: "text-gray-600 dark:text-gray-300 text-sm", children: [
            "显示第 ",
            (pagination.currentPage - 1) * pagination.pageSize + 1,
            " - ",
            Math.min(pagination.currentPage * pagination.pageSize, pagination.total),
            " 条，共 ",
            pagination.total,
            " 条记录"
          ] }) }),
          /* @__PURE__ */ jsx(
            Pagination,
            {
              value: pagination.currentPage,
              onChange: onPageChange,
              totalItems: pagination.total,
              itemsPerPage: pagination.pageSize,
              showPageSize: 5,
              forceEllipses: true,
              className: "custom-pagination [&_.rv-pagination]:text-gray-600 dark:[&_.rv-pagination]:text-gray-300 [&_.rv-pagination__item]:bg-gray-100 dark:[&_.rv-pagination__item]:bg-gray-700 [&_.rv-pagination__item:hover]:bg-gray-200 dark:[&_.rv-pagination__item:hover]:bg-gray-600 [&_.rv-pagination__item--active]:bg-blue-500",
              prevText: "上一页",
              nextText: "下一页"
            }
          )
        ] })
      ] })
    ] }) }),
    isLoading && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-8 text-center shadow-2xl transition-colors duration-300", children: [
      /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4" }),
      /* @__PURE__ */ jsxs("div", { className: "text-gray-900 dark:text-white text-lg font-bold", children: [
        "正在加载",
        specialConfig.title,
        "数据..."
      ] }),
      /* @__PURE__ */ jsx("div", { className: "text-gray-400 dark:text-gray-400 text-sm", children: "请稍候，精彩即将呈现" })
    ] }) }),
    error && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-8 text-center shadow-2xl max-w-md transition-colors duration-300", children: [
      /* @__PURE__ */ jsx("div", { className: "text-6xl mb-4", children: "😵" }),
      /* @__PURE__ */ jsx("h3", { className: "text-gray-900 dark:text-white text-xl font-bold mb-4", children: "加载失败" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-400 dark:text-gray-400 mb-6", children: error instanceof Error ? error.message : "网络连接出现问题" }),
      /* @__PURE__ */ jsx(
        Button,
        {
          onClick: () => window.location.reload(),
          className: "bg-blue-500 hover:bg-blue-600 border-0",
          children: "🔄 重新加载"
        }
      )
    ] }) })
  ] });
}

function Mobile({
  specialConfig,
  books,
  pagination,
  isLoading,
  error,
  onPageChange
}) {
  const { type } = useParams();
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300", children: [
    /* @__PURE__ */ jsx("nav", { className: `${specialConfig.bgColor} border-b-0 border-gray-700 sticky top-0 z-50 transition-colors duration-300`, children: /* @__PURE__ */ jsx("div", { className: "px-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-3", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsx("div", { className: "w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx(BookOpen, { className: "h-5 w-5 text-white" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-lg font-bold text-white", children: specialConfig.title }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-white/80", children: [
            "发现更多精彩 · ",
            specialConfig.description
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-2", children: /* @__PURE__ */ jsx(
        "button",
        {
          className: "p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors",
          onClick: () => {
          },
          children: /* @__PURE__ */ jsx(MoreHorizontal, { className: "h-5 w-5" })
        }
      ) })
    ] }) }) }),
    /* @__PURE__ */ jsx("div", { className: "bg-white dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200 px-4 py-3 transition-colors duration-300", children: /* @__PURE__ */ jsxs("div", { className: "flex space-x-2", children: [
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/special/completed",
          className: `flex-1 py-2 px-4 rounded-lg text-center transition-colors ${type === "completed" ? specialConfig.bgColor.replace("bg-gradient-to-r from-", "bg-").replace(" to-", "-").replace("-600", "-500") + " text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"}`,
          children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center space-x-1", children: [
            /* @__PURE__ */ jsx("span", { className: "text-lg", children: "🏆" }),
            /* @__PURE__ */ jsx("span", { className: "font-medium", children: "完结精品" })
          ] })
        }
      ),
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/special/new",
          className: `flex-1 py-2 px-4 rounded-lg text-center transition-colors ${type === "new" ? specialConfig.bgColor.replace("bg-gradient-to-r from-", "bg-").replace(" to-", "-").replace("-600", "-500") + " text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"}`,
          children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center space-x-1", children: [
            /* @__PURE__ */ jsx("span", { className: "text-lg", children: "✨" }),
            /* @__PURE__ */ jsx("span", { className: "font-medium", children: "最新上架" })
          ] })
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "px-4 py-4", children: [
      /* @__PURE__ */ jsxs("div", { className: `${specialConfig.bgColor} rounded-lg p-6 mb-6 text-white transition-colors duration-300`, children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxs("h2", { className: "text-2xl font-bold mb-2", children: [
              specialConfig.icon,
              " ",
              specialConfig.title
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-sm mb-4 opacity-90", children: specialConfig.description }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4 text-xs", children: [
              /* @__PURE__ */ jsxs("span", { children: [
                "📚 当前: ",
                /* @__PURE__ */ jsx("span", { className: "font-bold", children: specialConfig.title })
              ] }),
              /* @__PURE__ */ jsxs("span", { children: [
                "📊 总数: ",
                /* @__PURE__ */ jsx("span", { className: "font-bold", children: pagination.total })
              ] }),
              /* @__PURE__ */ jsxs("span", { children: [
                "📄 页码: ",
                /* @__PURE__ */ jsx("span", { className: "font-bold", children: pagination.currentPage })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold", children: pagination.total }),
            /* @__PURE__ */ jsx("div", { className: "text-sm opacity-90", children: type == "new" ? "连载" : "完结" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              block: true,
              type: "primary",
              className: "bg-white/20 hover:bg-white/30 border-0 h-10 text-white text-sm backdrop-blur-sm",
              children: "🔍 搜索小说"
            }
          ),
          /* @__PURE__ */ jsx(Link, { to: "/", children: /* @__PURE__ */ jsx(
            Button,
            {
              block: true,
              className: "bg-white/20 hover:bg-white/30 border-0 text-white h-10 text-sm backdrop-blur-sm",
              children: "🏠 返回首页"
            }
          ) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-gray-900 dark:text-white font-bold text-lg", children: [
            "✨ ",
            specialConfig.title,
            " 书籍"
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "text-sm text-gray-400 dark:text-gray-400", children: [
            pagination.total,
            " 本"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
          /* @__PURE__ */ jsxs(Button, { size: "small", className: "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white", children: [
            /* @__PURE__ */ jsx(Award, { className: "h-4 w-4 mr-1" }),
            "最新"
          ] }),
          /* @__PURE__ */ jsxs(Button, { size: "small", className: "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white", children: [
            /* @__PURE__ */ jsx(TrendingUp, { className: "h-4 w-4 mr-1" }),
            "热门"
          ] }),
          /* @__PURE__ */ jsxs(Button, { size: "small", className: "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white", children: [
            /* @__PURE__ */ jsx(Heart, { className: "h-4 w-4 mr-1" }),
            "收藏"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        books.map((book, index) => /* @__PURE__ */ jsx(
          BookCard,
          {
            book,
            layout: "mobile",
            showRank: true,
            rank: index,
            truncateLength: 80
          },
          book.id
        )),
        books.length === 0 && !isLoading && /* @__PURE__ */ jsx(Card, { className: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300", children: /* @__PURE__ */ jsxs("div", { className: "p-8 text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx("span", { className: "text-3xl", children: specialConfig.icon }) }),
          /* @__PURE__ */ jsx("h4", { className: "text-gray-400 dark:text-gray-400 font-medium mb-2", children: "暂无书籍" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-500 dark:text-gray-500 text-sm", children: "该专题下暂时没有书籍，敬请期待更多精彩内容！" })
        ] }) })
      ] }),
      pagination.totalPages > 1 && /* @__PURE__ */ jsx(Card, { className: "mt-6 mb-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300", children: /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-gray-600 dark:text-gray-300 text-sm", children: [
            "第 ",
            pagination.currentPage,
            " 页 / 共 ",
            pagination.totalPages,
            " 页"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                size: "small",
                disabled: pagination.currentPage === 1,
                onClick: () => onPageChange(pagination.currentPage - 1),
                className: "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white disabled:opacity-50",
                children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "px-3 py-1 bg-blue-500 text-white rounded text-sm font-bold", children: pagination.currentPage }),
            /* @__PURE__ */ jsx(
              Button,
              {
                size: "small",
                disabled: pagination.currentPage === pagination.totalPages,
                onClick: () => onPageChange(pagination.currentPage + 1),
                className: "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white disabled:opacity-50",
                children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-3 pt-3 border-t border-gray-200 dark:border-gray-700", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-5 gap-2", children: Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
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
          return /* @__PURE__ */ jsx(
            Button,
            {
              size: "small",
              type: pagination.currentPage === pageNum ? "primary" : "default",
              onClick: () => onPageChange(pageNum),
              className: pagination.currentPage === pageNum ? "bg-blue-500 border-0" : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 text-gray-700 dark:text-white",
              children: pageNum
            },
            pageNum
          );
        }) }) })
      ] }) }),
      /* @__PURE__ */ jsx(Card, { className: "mb-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300", children: /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
        /* @__PURE__ */ jsx("h4", { className: "text-gray-900 dark:text-white font-bold text-lg mb-4", children: "⚡ 快捷功能" }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
          /* @__PURE__ */ jsxs(Link, { to: "/special/completed", className: "text-center p-3 bg-purple-50 dark:bg-purple-900 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-800 cursor-pointer transition-colors", children: [
            /* @__PURE__ */ jsx(BookOpen, { className: "h-6 w-6 mx-auto mb-2 text-purple-500" }),
            /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-600 dark:text-gray-300", children: "完结精品" })
          ] }),
          /* @__PURE__ */ jsxs(Link, { to: "/special/new", className: "text-center p-3 bg-blue-50 dark:bg-blue-900 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 cursor-pointer transition-colors", children: [
            /* @__PURE__ */ jsx(Award, { className: "h-6 w-6 mx-auto mb-2 text-blue-500" }),
            /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-600 dark:text-gray-300", children: "最新上架" })
          ] }),
          /* @__PURE__ */ jsxs(Link, { to: "/", className: "text-center p-3 bg-green-50 dark:bg-green-900 rounded-lg hover:bg-green-100 dark:hover:bg-green-800 cursor-pointer transition-colors", children: [
            /* @__PURE__ */ jsx(Crown, { className: "h-6 w-6 mx-auto mb-2 text-green-500" }),
            /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-600 dark:text-gray-300", children: "返回首页" })
          ] })
        ] })
      ] }) }),
      isLoading && /* @__PURE__ */ jsx(Card, { className: "mt-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300", children: /* @__PURE__ */ jsx("div", { className: "p-8 text-center", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center", children: [
        /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mr-3" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "font-medium text-gray-900 dark:text-white", children: [
            "正在加载",
            specialConfig.title,
            "数据..."
          ] }),
          /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-400 dark:text-gray-400", children: "请稍候" })
        ] })
      ] }) }) }),
      error && /* @__PURE__ */ jsx(Card, { className: "mt-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300", children: /* @__PURE__ */ jsxs("div", { className: "p-8 text-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-blue-400 mb-4", children: [
          /* @__PURE__ */ jsx("div", { className: "text-4xl mb-2", children: "😵" }),
          /* @__PURE__ */ jsx("div", { className: "font-medium text-gray-900 dark:text-white", children: "加载失败" }),
          /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-400 dark:text-gray-400", children: error instanceof Error ? error.message : "未知错误" })
        ] }),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "primary",
            size: "small",
            className: "bg-blue-500 hover:bg-blue-600 border-0",
            onClick: () => window.location.reload(),
            children: "🔄 重新加载"
          }
        )
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("footer", { className: "bg-gray-800 dark:bg-gray-800 border-t border-gray-700 dark:border-gray-700 py-6 mt-8 transition-colors duration-300", children: /* @__PURE__ */ jsxs("div", { className: "px-4 text-center", children: [
      /* @__PURE__ */ jsxs("h4", { className: "font-bold text-white mb-3 text-lg", children: [
        specialConfig.icon,
        " ",
        specialConfig.title
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400 dark:text-gray-400 mb-4", children: specialConfig.description }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-center space-x-4 text-sm text-gray-500 dark:text-gray-500 mb-4", children: [
        /* @__PURE__ */ jsxs("span", { className: "flex items-center", children: [
          /* @__PURE__ */ jsx(Award, { className: "h-4 w-4 mr-1 text-purple-500" }),
          "品质"
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "flex items-center", children: [
          /* @__PURE__ */ jsx(TrendingUp, { className: "h-4 w-4 mr-1 text-blue-500" }),
          "更新"
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "flex items-center", children: [
          /* @__PURE__ */ jsx(Heart, { className: "h-4 w-4 mr-1 text-red-500" }),
          "推荐"
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "border-t border-gray-700 dark:border-gray-700 pt-4", children: /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 dark:text-gray-500", children: "© 2025 夜读小说网 · 专业的在线阅读平台" }) })
    ] }) })
  ] });
}

const baseUrl = undefined                            ;
const imgHost = undefined                            ;
const SPECIAL_CONFIGS = {
  completed: {
    type: "completed",
    title: "精品完结",
    description: "精选完结 · 无需等待完整阅读",
    icon: "🏆",
    bgColor: "bg-gradient-to-r from-purple-500 to-indigo-600",
    textColor: "text-purple-600"
  },
  new: {
    type: "new",
    title: "最新上架",
    description: "新鲜出炉 · 一月内精品新书",
    icon: "✨",
    bgColor: "bg-gradient-to-r from-blue-500 to-cyan-600",
    textColor: "text-blue-600"
  }
};
async function fetchSpecialBooks(params) {
  try {
    const {
      type,
      page,
      pageSize
    } = params;
    const offset = (page - 1) * pageSize;
    let sqlCondition = "";
    if (type === "completed") {
      sqlCondition = `WHERE b."status"='全本' AND b."deleteFlag" = false AND b."isShow" = true`;
    } else if (type === "new") {
      sqlCondition = `WHERE b."createTime" >= NOW() - INTERVAL '1 month' AND b."deleteFlag" = false AND b."isShow" = true`;
    }
    const [booksResponse, countResponse] = await Promise.all([fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        sql: `SELECT 
            b.id,
            b."name",
            b."desc",
            b."bookImage",
            b."status",
            b."fired",
            b."lastChapter",
            a."name" as "author",
            b."authorId" as "authorId",
            c."name" as "categoryName"
          FROM public.book b
          LEFT JOIN public.author a ON b."authorId" = a.id
          LEFT JOIN public.category c ON b."categoryId" = c.id
          ${sqlCondition}
          ORDER BY b."createTime" DESC
          LIMIT ${pageSize} OFFSET ${offset}`
      })
    }), fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        sql: `SELECT COUNT(*) as total
          FROM public.book b
          ${sqlCondition}`
      })
    })]);
    if (!booksResponse.ok || !countResponse.ok) {
      throw new Error(`HTTP error! books: ${booksResponse.status}, count: ${countResponse.status}`);
    }
    const booksResult = await booksResponse.json();
    const countResult = await countResponse.json();
    if (!booksResult.success) {
      throw new Error(booksResult.message || "获取书籍数据失败");
    }
    if (!countResult.success) {
      throw new Error(countResult.message || "获取统计数据失败");
    }
    const processedBooks = booksResult.data?.map((book) => ({
      ...book,
      bookImage: book.bookImage ? `${imgHost}${book.bookImage}` : void 0
    })) || [];
    const total = countResult.data?.[0]?.total || 0;
    return {
      books: processedBooks,
      total
    };
  } catch (error) {
    console.error("获取专题书籍数据失败:", error);
    throw error;
  }
}
function useSpecialBooks(type, page, pageSize) {
  return useQuery({
    queryKey: ["specialBooks", type, page],
    queryFn: () => fetchSpecialBooks({
      type,
      page,
      pageSize
    }),
    staleTime: 2 * 60 * 1e3,
    // 2分钟缓存
    refetchOnWindowFocus: false,
    refetchOnMount: "always",
    enabled: !!type
    // 只有当type存在时才执行查询
  });
}
function formatHeat(fired) {
  if (fired >= 1e4) {
    return `🔥 ${(fired / 1e4).toFixed(1)}万`;
  } else if (fired >= 1e3) {
    return `🔥 ${(fired / 1e3).toFixed(1)}千`;
  } else {
    return `🔥 ${fired}`;
  }
}
function getSpecialConfig(type) {
  const specialType = type;
  return SPECIAL_CONFIGS[specialType] || SPECIAL_CONFIGS.completed;
}
const index = UNSAFE_withComponentProps(function Special() {
  const {
    type
  } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;
  const specialConfig = getSpecialConfig(type || "completed");
  const {
    data: booksData,
    isLoading,
    error
  } = useSpecialBooks(type, currentPage, pageSize);
  const pagination = useMemo(() => {
    const total = booksData?.total || 0;
    const totalPages = Math.ceil(total / pageSize);
    return {
      currentPage,
      pageSize,
      total,
      totalPages
    };
  }, [booksData?.total, currentPage, pageSize]);
  useEffect(() => {
    setCurrentPage(1);
  }, [type]);
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  if (!["completed", "new"].includes(type || "")) {
    return /* @__PURE__ */ jsx("div", {
      className: "min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center",
      children: /* @__PURE__ */ jsxs("div", {
        className: "text-center",
        children: [/* @__PURE__ */ jsx("h2", {
          className: "text-2xl font-bold text-gray-900 dark:text-white mb-4",
          children: "页面不存在"
        }), /* @__PURE__ */ jsx("p", {
          className: "text-gray-600 dark:text-gray-400",
          children: "请检查URL是否正确"
        })]
      })
    });
  }
  return /* @__PURE__ */ jsx("div", {
    className: "min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300",
    children: isMobile ? /* @__PURE__ */ jsx(Mobile, {
      specialConfig,
      books: booksData?.books || [],
      pagination,
      isLoading,
      error,
      onPageChange: handlePageChange
    }) : /* @__PURE__ */ jsx(PC, {
      specialConfig,
      books: booksData?.books || [],
      pagination,
      isLoading,
      error,
      onPageChange: handlePageChange
    })
  });
});

const route5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index,
  formatHeat,
  getSpecialConfig,
  useSpecialBooks
}, Symbol.toStringTag, { value: 'Module' }));

const notFound = UNSAFE_withComponentProps(function NotFound() {
  const navigate = useNavigate();
  const handleBackHome = () => {
    navigate("/");
  };
  const handleGoBack = () => {
    window.history.back();
  };
  return /* @__PURE__ */jsx("div", {
    className: "min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 flex items-center justify-center p-4",
    children: /* @__PURE__ */jsxs("div", {
      className: "w-full max-w-4xl mx-auto",
      children: [/* @__PURE__ */jsx("div", {
        className: "hidden md:block",
        children: /* @__PURE__ */jsxs("div", {
          className: "text-center",
          children: [/* @__PURE__ */jsxs("div", {
            className: "relative mb-8",
            children: [/* @__PURE__ */jsx("h1", {
              className: "text-9xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent",
              children: "404"
            }), /* @__PURE__ */jsx("div", {
              className: "absolute inset-0 text-9xl font-bold text-blue-200 dark:text-blue-800 opacity-20 animate-pulse",
              children: "404"
            })]
          }), /* @__PURE__ */jsxs("div", {
            className: "mb-12",
            children: [/* @__PURE__ */jsx("h2", {
              className: "text-4xl font-bold text-gray-900 dark:text-white mb-4",
              children: "页面丢失了 📚"
            }), /* @__PURE__ */jsx("p", {
              className: "text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed",
              children: "看起来您要找的书籍页面不在书架上了。不要担心，让我们帮您找到正确的方向。"
            })]
          }), /* @__PURE__ */jsx("div", {
            className: "mb-12",
            children: /* @__PURE__ */jsxs("div", {
              className: "relative",
              children: [/* @__PURE__ */jsx(BookOpen, {
                className: "h-32 w-32 text-gray-300 dark:text-gray-600 mx-auto"
              }), /* @__PURE__ */jsx("div", {
                className: "absolute -top-2 -right-2 w-8 h-8 bg-red-400 rounded-full animate-bounce"
              }), /* @__PURE__ */jsx("div", {
                className: "absolute -bottom-2 -left-2 w-6 h-6 bg-yellow-400 rounded-full animate-bounce delay-100"
              })]
            })
          }), /* @__PURE__ */jsxs("div", {
            className: "flex justify-center space-x-4 mb-12",
            children: [/* @__PURE__ */jsx(Button, {
              type: "primary",
              size: "large",
              icon: /* @__PURE__ */jsx(Home, {
                className: "h-5 w-5"
              }),
              onClick: handleBackHome,
              className: "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-none",
              style: {
                borderRadius: "12px",
                padding: "12px 32px"
              },
              children: "返回首页"
            }), /* @__PURE__ */jsx(Button, {
              type: "default",
              size: "large",
              icon: /* @__PURE__ */jsx(Search, {
                className: "h-5 w-5"
              }),
              onClick: () => navigate("/search"),
              className: "border-2 border-gray-300 hover:border-blue-400 text-gray-700 hover:text-blue-600",
              style: {
                borderRadius: "12px",
                padding: "12px 32px"
              },
              children: "搜索图书"
            }), /* @__PURE__ */jsx(Button, {
              type: "default",
              size: "large",
              icon: /* @__PURE__ */jsx(ArrowLeft, {
                className: "h-5 w-5"
              }),
              onClick: handleGoBack,
              className: "border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900",
              style: {
                borderRadius: "12px",
                padding: "12px 32px"
              },
              children: "上一页"
            })]
          }), /* @__PURE__ */jsxs(Card, {
            className: "max-w-2xl mx-auto bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-xl",
            children: [/* @__PURE__ */jsx(Card.Header, {
              children: /* @__PURE__ */jsxs("h3", {
                className: "text-lg font-semibold text-gray-900 dark:text-white flex items-center",
                children: [/* @__PURE__ */jsx(Search, {
                  className: "h-5 w-5 mr-2 text-blue-500"
                }), "您可能在寻找"]
              })
            }), /* @__PURE__ */jsx(Card.Body, {
              children: /* @__PURE__ */jsxs("div", {
                className: "grid grid-cols-2 gap-4 text-sm",
                children: [/* @__PURE__ */jsxs("div", {
                  className: "p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer transition-colors",
                  onClick: () => navigate("/"),
                  children: [/* @__PURE__ */jsx("div", {
                    className: "font-medium text-gray-900 dark:text-white",
                    children: "首页"
                  }), /* @__PURE__ */jsx("div", {
                    className: "text-gray-500 dark:text-gray-400",
                    children: "浏览所有图书"
                  })]
                }), /* @__PURE__ */jsxs("div", {
                  className: "p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/30 cursor-pointer transition-colors",
                  onClick: () => navigate("/category"),
                  children: [/* @__PURE__ */jsx("div", {
                    className: "font-medium text-gray-900 dark:text-white",
                    children: "分类浏览"
                  }), /* @__PURE__ */jsx("div", {
                    className: "text-gray-500 dark:text-gray-400",
                    children: "按类别查找"
                  })]
                }), /* @__PURE__ */jsxs("div", {
                  className: "p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/30 cursor-pointer transition-colors",
                  onClick: () => navigate("/favorites"),
                  children: [/* @__PURE__ */jsx("div", {
                    className: "font-medium text-gray-900 dark:text-white",
                    children: "我的收藏"
                  }), /* @__PURE__ */jsx("div", {
                    className: "text-gray-500 dark:text-gray-400",
                    children: "查看收藏的书籍"
                  })]
                }), /* @__PURE__ */jsxs("div", {
                  className: "p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/30 cursor-pointer transition-colors",
                  onClick: () => navigate("/recent"),
                  children: [/* @__PURE__ */jsx("div", {
                    className: "font-medium text-gray-900 dark:text-white",
                    children: "最近阅读"
                  }), /* @__PURE__ */jsx("div", {
                    className: "text-gray-500 dark:text-gray-400",
                    children: "继续上次阅读"
                  })]
                })]
              })
            })]
          })]
        })
      }), /* @__PURE__ */jsx("div", {
        className: "md:hidden",
        children: /* @__PURE__ */jsxs("div", {
          className: "text-center",
          children: [/* @__PURE__ */jsx("div", {
            className: "relative mb-6",
            children: /* @__PURE__ */jsx("h1", {
              className: "text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent",
              children: "404"
            })
          }), /* @__PURE__ */jsxs("div", {
            className: "mb-8",
            children: [/* @__PURE__ */jsx("h2", {
              className: "text-2xl font-bold text-gray-900 dark:text-white mb-3",
              children: "页面丢失了 📚"
            }), /* @__PURE__ */jsx("p", {
              className: "text-gray-600 dark:text-gray-300 leading-relaxed",
              children: "看起来您要找的内容不在这里"
            })]
          }), /* @__PURE__ */jsx("div", {
            className: "mb-8",
            children: /* @__PURE__ */jsx(BookOpen, {
              className: "h-20 w-20 text-gray-300 dark:text-gray-600 mx-auto"
            })
          }), /* @__PURE__ */jsxs("div", {
            className: "space-y-3 mb-6",
            children: [/* @__PURE__ */jsx(Button, {
              type: "primary",
              block: true,
              icon: /* @__PURE__ */jsx(Home, {
                className: "h-5 w-5"
              }),
              onClick: handleBackHome,
              className: "h-12 text-base",
              children: "返回首页"
            }), /* @__PURE__ */jsx(Button, {
              type: "default",
              block: true,
              icon: /* @__PURE__ */jsx(Search, {
                className: "h-5 w-5"
              }),
              onClick: () => navigate("/search"),
              className: "h-12 text-base",
              children: "搜索图书"
            })]
          }), /* @__PURE__ */jsx(Card, {
            className: "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0",
            children: /* @__PURE__ */jsxs(Card.Body, {
              children: [/* @__PURE__ */jsxs("h3", {
                className: "text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center justify-center",
                children: [/* @__PURE__ */jsx(Search, {
                  className: "h-5 w-5 mr-2 text-blue-500"
                }), "推荐入口"]
              }), /* @__PURE__ */jsxs("div", {
                className: "space-y-3",
                children: [/* @__PURE__ */jsxs("div", {
                  className: "p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer transition-colors",
                  onClick: () => navigate("/"),
                  children: [/* @__PURE__ */jsx("div", {
                    className: "font-medium text-gray-900 dark:text-white",
                    children: "首页"
                  }), /* @__PURE__ */jsx("div", {
                    className: "text-sm text-gray-500 dark:text-gray-400",
                    children: "浏览所有图书"
                  })]
                }), /* @__PURE__ */jsxs("div", {
                  className: "p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/30 cursor-pointer transition-colors",
                  onClick: () => navigate("/category"),
                  children: [/* @__PURE__ */jsx("div", {
                    className: "font-medium text-gray-900 dark:text-white",
                    children: "分类浏览"
                  }), /* @__PURE__ */jsx("div", {
                    className: "text-sm text-gray-500 dark:text-gray-400",
                    children: "按类别查找"
                  })]
                })]
              })]
            })
          })]
        })
      }), /* @__PURE__ */jsx("footer", {
        className: "mt-12 text-center",
        children: /* @__PURE__ */jsx("p", {
          className: "text-sm text-gray-500 dark:text-gray-400",
          children: "如果问题持续存在，请联系我们的技术支持"
        })
      })]
    })
  });
});

const route6 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: notFound
}, Symbol.toStringTag, { value: 'Module' }));

const serverManifest = {'entry':{'module':'/assets/entry.client-BbD8eRky.js','imports':['/assets/chunk-4WY6JWTD-C8hUu7FM.js'],'css':[]},'routes':{'root':{'id':'root','parentId':undefined,'path':'','index':undefined,'caseSensitive':undefined,'hasAction':false,'hasLoader':false,'hasClientAction':false,'hasClientLoader':false,'hasClientMiddleware':false,'hasErrorBoundary':true,'module':'/assets/root-Cg9NFgso.js','imports':['/assets/chunk-4WY6JWTD-C8hUu7FM.js','/assets/useThemeStore-1SLxPlrM.js','/assets/tslib.es6-DSVQIQwf.js'],'css':['/assets/root-D4rBY4_V.css'],'clientActionModule':undefined,'clientLoaderModule':undefined,'clientMiddlewareModule':undefined,'hydrateFallbackModule':undefined},'routes/home/index':{'id':'routes/home/index','parentId':'root','path':undefined,'index':true,'caseSensitive':undefined,'hasAction':false,'hasLoader':false,'hasClientAction':false,'hasClientLoader':false,'hasClientMiddleware':false,'hasErrorBoundary':false,'module':'/assets/index-CHEHJ3oN.js','imports':['/assets/chunk-4WY6JWTD-C8hUu7FM.js','/assets/Navbar-BU5JMsWt.js','/assets/index-q_CzaxUD.js','/assets/tslib.es6-DSVQIQwf.js','/assets/trending-up-iY1VF07-.js','/assets/x-DdChSub8.js','/assets/useThemeStore-1SLxPlrM.js'],'css':['/assets/index-BFMpQ060.css'],'clientActionModule':undefined,'clientLoaderModule':undefined,'clientMiddlewareModule':undefined,'hydrateFallbackModule':undefined},'routes/book/index':{'id':'routes/book/index','parentId':'root','path':'book/:bookId','index':undefined,'caseSensitive':undefined,'hasAction':false,'hasLoader':false,'hasClientAction':false,'hasClientLoader':false,'hasClientMiddleware':false,'hasErrorBoundary':false,'module':'/assets/index-BOzGEPtc.js','imports':['/assets/chunk-4WY6JWTD-C8hUu7FM.js','/assets/Navbar-BU5JMsWt.js','/assets/index-q_CzaxUD.js','/assets/tslib.es6-DSVQIQwf.js','/assets/arrow-left-D9bP5OPe.js','/assets/useThemeStore-1SLxPlrM.js'],'css':['/assets/index-JXk-1Yq7.css','/assets/index-BFMpQ060.css'],'clientActionModule':undefined,'clientLoaderModule':undefined,'clientMiddlewareModule':undefined,'hydrateFallbackModule':undefined},'routes/category/index':{'id':'routes/category/index','parentId':'root','path':'category/:categoryId','index':undefined,'caseSensitive':undefined,'hasAction':false,'hasLoader':false,'hasClientAction':false,'hasClientLoader':false,'hasClientMiddleware':false,'hasErrorBoundary':false,'module':'/assets/index-C88h5kYI.js','imports':['/assets/chunk-4WY6JWTD-C8hUu7FM.js','/assets/Navbar-BU5JMsWt.js','/assets/useThemeStore-1SLxPlrM.js','/assets/index-q_CzaxUD.js','/assets/BookCard-CzkRne-i.js','/assets/x-DdChSub8.js','/assets/trending-up-iY1VF07-.js','/assets/tslib.es6-DSVQIQwf.js'],'css':['/assets/index-BLPVKoPK.css','/assets/index-BFMpQ060.css'],'clientActionModule':undefined,'clientLoaderModule':undefined,'clientMiddlewareModule':undefined,'hydrateFallbackModule':undefined},'routes/author/index':{'id':'routes/author/index','parentId':'root','path':'author/:authorId','index':undefined,'caseSensitive':undefined,'hasAction':false,'hasLoader':false,'hasClientAction':false,'hasClientLoader':false,'hasClientMiddleware':false,'hasErrorBoundary':false,'module':'/assets/index-BZEVWit_.js','imports':['/assets/chunk-4WY6JWTD-C8hUu7FM.js','/assets/Navbar-BU5JMsWt.js','/assets/index-q_CzaxUD.js','/assets/arrow-left-D9bP5OPe.js','/assets/trending-up-iY1VF07-.js','/assets/useThemeStore-1SLxPlrM.js','/assets/tslib.es6-DSVQIQwf.js'],'css':['/assets/index-BFMpQ060.css'],'clientActionModule':undefined,'clientLoaderModule':undefined,'clientMiddlewareModule':undefined,'hydrateFallbackModule':undefined},'routes/special/index':{'id':'routes/special/index','parentId':'root','path':'special/:type','index':undefined,'caseSensitive':undefined,'hasAction':false,'hasLoader':false,'hasClientAction':false,'hasClientLoader':false,'hasClientMiddleware':false,'hasErrorBoundary':false,'module':'/assets/index-BAotp0em.js','imports':['/assets/chunk-4WY6JWTD-C8hUu7FM.js','/assets/Navbar-BU5JMsWt.js','/assets/index-q_CzaxUD.js','/assets/BookCard-CzkRne-i.js','/assets/trending-up-iY1VF07-.js','/assets/useThemeStore-1SLxPlrM.js','/assets/tslib.es6-DSVQIQwf.js'],'css':['/assets/index-BFMpQ060.css'],'clientActionModule':undefined,'clientLoaderModule':undefined,'clientMiddlewareModule':undefined,'hydrateFallbackModule':undefined},'routes/not-found':{'id':'routes/not-found','parentId':'root','path':'*','index':undefined,'caseSensitive':undefined,'hasAction':false,'hasLoader':false,'hasClientAction':false,'hasClientLoader':false,'hasClientMiddleware':false,'hasErrorBoundary':false,'module':'/assets/not-found-BHMv_lwo.js','imports':['/assets/chunk-4WY6JWTD-C8hUu7FM.js','/assets/index-q_CzaxUD.js','/assets/tslib.es6-DSVQIQwf.js','/assets/arrow-left-D9bP5OPe.js'],'css':['/assets/index-BFMpQ060.css'],'clientActionModule':undefined,'clientLoaderModule':undefined,'clientMiddlewareModule':undefined,'hydrateFallbackModule':undefined}},'url':'/assets/manifest-ec693c9a.js','version':'ec693c9a','sri':undefined};

const assetsBuildDirectory = "build\\client";
      const basename = "/";
      const future = {"v8_middleware":false,"unstable_optimizeDeps":false,"unstable_splitRouteModules":false,"unstable_subResourceIntegrity":false,"unstable_viteEnvironmentApi":false};
      const ssr = true;
      const isSpaMode = false;
      const prerender = ["/"];
      const routeDiscovery = {"mode":"lazy","manifestPath":"/__manifest"};
      const publicPath = "/";
      const entry = { module: entryServer };
      const routes = {
        "root": {
          id: "root",
          parentId: undefined,
          path: "",
          index: undefined,
          caseSensitive: undefined,
          module: route0
        },
  "routes/home/index": {
          id: "routes/home/index",
          parentId: "root",
          path: undefined,
          index: true,
          caseSensitive: undefined,
          module: route1
        },
  "routes/book/index": {
          id: "routes/book/index",
          parentId: "root",
          path: "book/:bookId",
          index: undefined,
          caseSensitive: undefined,
          module: route2
        },
  "routes/category/index": {
          id: "routes/category/index",
          parentId: "root",
          path: "category/:categoryId",
          index: undefined,
          caseSensitive: undefined,
          module: route3
        },
  "routes/author/index": {
          id: "routes/author/index",
          parentId: "root",
          path: "author/:authorId",
          index: undefined,
          caseSensitive: undefined,
          module: route4
        },
  "routes/special/index": {
          id: "routes/special/index",
          parentId: "root",
          path: "special/:type",
          index: undefined,
          caseSensitive: undefined,
          module: route5
        },
  "routes/not-found": {
          id: "routes/not-found",
          parentId: "root",
          path: "*",
          index: undefined,
          caseSensitive: undefined,
          module: route6
        }
      };

export { serverManifest as assets, assetsBuildDirectory, basename, entry, future, isSpaMode, prerender, publicPath, routeDiscovery, routes, ssr };
