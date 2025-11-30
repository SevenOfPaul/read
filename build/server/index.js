import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { renderToString } from 'react-dom/server';
import { ServerRouter, UNSAFE_withComponentProps, Outlet, Meta, Links, ScrollRestoration, Scripts } from 'react-router';

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

function Layout({
  children
}) {
  return /* @__PURE__ */jsxs("html", {
    lang: "zh-CN",
    children: [/* @__PURE__ */jsxs("head", {
      children: [/* @__PURE__ */jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */jsx(Meta, {}), /* @__PURE__ */jsx(Links, {}), /* @__PURE__ */jsx("title", {
        children: "React Router v7 SSR - Cloudflare Pages"
      }), /* @__PURE__ */jsx("style", {
        children: `
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
              'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
              sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            background-color: #f5f5f5;
            color: #333;
          }
          
          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1rem;
          }
          
          header {
            background-color: #fff;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            padding: 1rem 0;
            margin-bottom: 2rem;
          }
          
          nav {
            display: flex;
            gap: 2rem;
          }
          
          nav a {
            text-decoration: none;
            color: #333;
            font-weight: 500;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            transition: background-color 0.2s;
          }
          
          nav a:hover {
            background-color: #f0f0f0;
          }
          
          nav a.active {
            background-color: #007bff;
            color: white;
          }
          
          main {
            min-height: calc(100vh - 200px);
            padding: 2rem 0;
          }
          
          footer {
            background-color: #333;
            color: white;
            text-align: center;
            padding: 2rem 0;
            margin-top: 2rem;
          }
          
          .hero {
            text-align: center;
            padding: 4rem 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 8px;
            margin-bottom: 3rem;
          }
          
          .hero h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            font-weight: 700;
          }
          
          .hero p {
            font-size: 1.25rem;
            opacity: 0.9;
            margin-bottom: 2rem;
          }
          
          .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin: 3rem 0;
          }
          
          .feature-card {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            text-align: center;
          }
          
          .feature-card h3 {
            margin-bottom: 1rem;
            color: #333;
          }
          
          .feature-card p {
            color: #666;
            line-height: 1.6;
          }
          
          .btn {
            display: inline-block;
            padding: 0.75rem 1.5rem;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            font-weight: 500;
            transition: background-color 0.2s;
            border: none;
            cursor: pointer;
          }
          
          .btn:hover {
            background-color: #0056b3;
          }
          
          .btn-secondary {
            background-color: #6c757d;
          }
          
          .btn-secondary:hover {
            background-color: #545b62;
          }
        `
      })]
    }), /* @__PURE__ */jsxs("body", {
      children: [children, /* @__PURE__ */jsx(ScrollRestoration, {}), /* @__PURE__ */jsx(Scripts, {})]
    })]
  });
}
const root = UNSAFE_withComponentProps(function App() {
  return /* @__PURE__ */jsxs(Fragment, {
    children: [/* @__PURE__ */jsx("header", {
      children: /* @__PURE__ */jsx("div", {
        className: "container",
        children: /* @__PURE__ */jsxs("nav", {
          children: [/* @__PURE__ */jsx("a", {
            href: "/",
            children: "首页"
          }), /* @__PURE__ */jsx("a", {
            href: "/about",
            children: "关于"
          }), /* @__PURE__ */jsx("a", {
            href: "/contact",
            children: "联系"
          }), /* @__PURE__ */jsx("a", {
            href: "/blog",
            children: "博客"
          })]
        })
      })
    }), /* @__PURE__ */jsx("main", {
      className: "container",
      children: /* @__PURE__ */jsx(Outlet, {})
    }), /* @__PURE__ */jsx("footer", {
      children: /* @__PURE__ */jsx("div", {
        className: "container",
        children: /* @__PURE__ */jsx("p", {
          children: "© 2025 React Router v7 SSR 应用 - 部署在 Cloudflare Pages"
        })
      })
    })]
  });
});

const route0 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  Layout,
  default: root
}, Symbol.toStringTag, { value: 'Module' }));

const serverManifest = {'entry':{'module':'/assets/entry.client-Bcu9lfeb.js','imports':['/assets/chunk-4WY6JWTD-yWmQzyKN.js'],'css':[]},'routes':{'root':{'id':'root','parentId':undefined,'path':'','index':undefined,'caseSensitive':undefined,'hasAction':false,'hasLoader':false,'hasClientAction':false,'hasClientLoader':false,'hasClientMiddleware':false,'hasErrorBoundary':false,'module':'/assets/root-xvKY9FY3.js','imports':['/assets/chunk-4WY6JWTD-yWmQzyKN.js'],'css':[],'clientActionModule':undefined,'clientLoaderModule':undefined,'clientMiddlewareModule':undefined,'hydrateFallbackModule':undefined}},'url':'/assets/manifest-54a1f0bd.js','version':'54a1f0bd','sri':undefined};

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
        }
      };

export { serverManifest as assets, assetsBuildDirectory, basename, entry, future, isSpaMode, prerender, publicPath, routeDiscovery, routes, ssr };
