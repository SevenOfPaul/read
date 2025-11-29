import { createRequestHandler } from "@react-router/cloudflare";
import * as build from "./build/server/index.js";

export default {
  async fetch(request, env, ctx) {
    const handler = createRequestHandler({
      build,
      mode: process.env.NODE_ENV,
      getLoadContext() {
        // 确保传递完整的 Cloudflare 上下文
        return {
          env,
          cf: request.cf,
          ctx,
        };
      },
    });

    return handler(request);
  },
};
