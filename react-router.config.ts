import type { Config } from "@react-router/dev/config";

export default {
  // 启用服务器端渲染
  ssr: true,
  
  // 预渲染特定路由以提升性能
  async prerender() {
    return ["/"];
  },
  
  // Cloudflare Pages 适配器配置
  // 这些是可选的 Cloudflare Pages 配置
  serverModuleFormat: "esm",
  
  // Tailwind CSS 支持（可选）
  // tailwind: true,
  
} satisfies Config;
