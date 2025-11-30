/// <reference types="@cloudflare/workers-types" />
import { createRequestHandler } from "react-router";

declare module "react-router" {
  export interface AppLoadContext {
    cloudflare: {
      env: Env;
      ctx: ExecutionContext;
    };
  }
}

interface Env {
  // 在这里定义您的环境变量
  [key: string]: string | undefined;
}

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  "production",
);

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return requestHandler(request, {
      cloudflare: { env, ctx },
    });
  },
} satisfies ExportedHandler<Env>;
