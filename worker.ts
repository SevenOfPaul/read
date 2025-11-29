/// <reference types="@cloudflare/workers-types" />

import { createRequestHandler } from "@react-router/cloudflare";

declare module "react-router" {
  export interface AppLoadContext {
    cloudflare: {
       //@ts-ignore
      env: Env;
      ctx: ExecutionContext;
    };
  }
}

const build = () => import("virtual:react-router/server-build");

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    //@ts-ignore
    return createRequestHandler(build, import.meta.env.MODE)(request, {
      cloudflare: { env, ctx },
    });
  },
   //@ts-ignore
} satisfies ExportedHandler<Env>;
