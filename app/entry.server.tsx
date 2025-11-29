/**
 * React Router v7 + Cloudflare Pages 服务端入口
 * 夜读小说网 - SSR 页面渲染
 */
import type { AppLoadContext } from "react-router";
import { createRequestHandler } from "react-router";

// 声明 Cloudflare 上下文类型
declare module "react-router" {
  export interface AppLoadContext {
    cloudflare: {
      env: {
        WEBHOST: string;
        [key: string]: string;
      };
      ctx: ExecutionContext;
    };
  }
}

// 创建请求处理器
const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE,
);

// 导出 Cloudflare Pages 处理函数
export default {
  async fetch(request: Request, env: any, ctx: ExecutionContext) {
    return requestHandler(request, {
      cloudflare: { env, ctx },
    });
  },
} satisfies ExportedHandler;
