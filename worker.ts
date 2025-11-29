/// <reference types="@cloudflare/workers-types" />

import { createRequestHandler } from "@react-router/cloudflare";

declare module "react-router" {
  export interface AppLoadContext {
    cloudflare: {
      env: Env;
      ctx: ExecutionContext;
    };
  }
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // 运行时动态导入构建后的服务器文件
    const serverBuild = await import("./build/server/index.js");
    const requestHandler = createRequestHandler(serverBuild, import.meta.env.MODE);
    
    return requestHandler(request, {
      cloudflare: { env, ctx },
    });
  },
} satisfies ExportedHandler<Env>;
