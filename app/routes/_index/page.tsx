export default function Index() {
  return (
    <div>
      <div className="hero">
        <h1>欢迎使用 React Router v7 SSR</h1>
        <p>这是一个运行在 Cloudflare Pages 上的现代化 React 应用</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
          <a href="https://reactrouter.com" target="_blank" rel="noopener noreferrer" className="btn">
            React Router 文档
          </a>
          <a href="https://developers.cloudflare.com/pages/" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
            Cloudflare Pages 文档
          </a>
        </div>
      </div>
      
      <div className="features">
        <div className="feature-card">
          <h3>🚀 React Router v7</h3>
          <p>使用最新的 React Router v7，享受强大的路由功能和现代化的开发体验。</p>
        </div>
        
        <div className="feature-card">
          <h3>⚡ SSR 支持</h3>
          <p>完整的服务器端渲染支持，提供优秀的 SEO 优化和首屏加载速度。</p>
        </div>
        
        <div className="feature-card">
          <h3>☁️ Cloudflare Pages</h3>
          <p>部署在全球边缘网络，享受极速的全球访问体验。</p>
        </div>
        
        <div className="feature-card">
          <h3>🎯 TypeScript</h3>
          <p>完整的 TypeScript 支持，提供类型安全和更好的开发体验。</p>
        </div>
        
        <div className="feature-card">
          <h3>🔧 Vite</h3>
          <p>基于 Vite 构建工具，享受极速的开发体验和优化后的构建输出。</p>
        </div>
        
        <div className="feature-card">
          <h3>📱 响应式设计</h3>
          <p>原生支持移动设备，提供跨设备的优秀用户体验。</p>
        </div>
      </div>
      
      <div style={{ textAlign: 'center', margin: '3rem 0' }}>
        <h2 style={{ marginBottom: '1rem', color: '#333' }}>技术栈</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
          <span style={{ 
            backgroundColor: '#61dafb', 
            color: '#282c34', 
            padding: '0.5rem 1rem', 
            borderRadius: '4px', 
            fontWeight: 'bold' 
          }}>React 18</span>
          <span style={{ 
            backgroundColor: '#ff6b6b', 
            color: 'white', 
            padding: '0.5rem 1rem', 
            borderRadius: '4px', 
            fontWeight: 'bold' 
          }}>React Router v7</span>
          <span style={{ 
            backgroundColor: '#4ecdc4', 
            color: 'white', 
            padding: '0.5rem 1rem', 
            borderRadius: '4px', 
            fontWeight: 'bold' 
          }}>TypeScript</span>
          <span style={{ 
            backgroundColor: '#667eea', 
            color: 'white', 
            padding: '0.5rem 1rem', 
            borderRadius: '4px', 
            fontWeight: 'bold' 
          }}>Vite</span>
          <span style={{ 
            backgroundColor: '#f39c12', 
            color: 'white', 
            padding: '0.5rem 1rem', 
            borderRadius: '4px', 
            fontWeight: 'bold' 
          }}>Cloudflare Pages</span>
        </div>
      </div>
    </div>
  );
}
