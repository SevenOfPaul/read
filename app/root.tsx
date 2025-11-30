import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <title>React Router v7 SSR - Cloudflare Pages</title>
        <style>{`
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
        `}</style>
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <>
      <header>
        <div className="container">
          <nav>
            <a href="/">首页</a>
            <a href="/about">关于</a>
            <a href="/contact">联系</a>
            <a href="/blog">博客</a>
          </nav>
        </div>
      </header>
      
      <main className="container">
        <Outlet />
      </main>
      
      <footer>
        <div className="container">
          <p>&copy; 2025 React Router v7 SSR 应用 - 部署在 Cloudflare Pages</p>
        </div>
      </footer>
    </>
  );
}
