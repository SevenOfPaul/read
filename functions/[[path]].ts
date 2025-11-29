import { createRequestHandler } from "react-router";

// 声明 Cloudflare 上下文类型
declare module "react-router" {
  export interface AppLoadContext {
    cloudflare: {
      env: {
        WEBHOST: string;
        [key: string]: string;
      };
      ctx: any;
    };
  }
}

// 处理自定义数据和响应头
function handleDataRequest(
  response: Response,
  {
    request,
    params,
    context,
  }: {
    request: Request;
    params: Record<string, string>;
    context: any;
  }
) {
  // 添加自定义头部
  response.headers.set("X-Custom-Header", "night-reading-novel");
  response.headers.set("X-Site-Title", "夜读小说网");
  response.headers.set("X-Framework", "React Router v7 + Cloudflare Workers");
  response.headers.set("X-Version", "1.0.0");
  
  return response;
}

// 创建请求处理器 - 使用 React Router v7 的虚拟模块路径
const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE,
);

// 导出 Cloudflare Workers 处理函数
export default {
  async fetch(request: Request, env: any, ctx: any) {
    try {
      const response = await requestHandler(request, {
        cloudflare: { env, ctx },
      });
      
      // 确保自定义头部被设置
      if (!response.headers.get("X-Custom-Header")) {
        return handleDataRequest(response, {
          request,
          params: {},
          context: { env, ctx },
        });
      }
      
      return response;
    } catch (error) {
      console.error("服务器渲染错误:", error);
      
      // 返回错误响应
      return new Response("内部服务器错误", {
        status: 500,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "X-Custom-Header": "night-reading-novel",
          "X-Error": "true",
        },
      });
    }
  },
};
