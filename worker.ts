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

const requestHandler = createRequestHandler(
  () => import("./build/server/index.js"),
  import.meta.env.MODE,
);

export default {
      //@ts-ignore
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    //@ts-ignore
    return createRequestHandler(build, import.meta.env.MODE)(request, {
      cloudflare: { env, ctx },
    });
  },
   //@ts-ignore
} satisfies ExportedHandler<Env>;
