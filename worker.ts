import { createRequestHandler } from "@react-router/cloudflare";

export default {
  async fetch(request, env, ctx) {
    try {
      // 检查构建文件是否存在
      const build = await import("./build/server/index.js").catch(() => null);
      
      if (!build) {
        return new Response("Build files not found", { status: 500 });
      }

      const handler = createRequestHandler({
        build,
        mode: process.env.NODE_ENV || "production",
        getLoadContext() {
          return { env };
        },
      });

      return handler(request);
    } catch (error) {
      console.error("Worker error:", error);
      return new Response(`Error: ${error.message}`, { 
        status: 500 
      });
    }
  },
};
