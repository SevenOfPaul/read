import type { RequestHandler } from "react-router";

import {
  createRequestHandler,
  RouterContextProvider,
} from "react-router";

let handler: null | RequestHandler = null;

export default {
  async fetch(request: Request) {
    // Dynamically import React Router server build
    // This helps reduce worker init time
    let build = await import("virtual:react-router/server-build");
    // Only create a request handler if `handler` is still null (first request)
    if (handler === null) handler = createRequestHandler(build);

    // Create a new router context for each request
    let context = new RouterContextProvider();

    // Call the handler with the request and context and return the response
    //@ts-ignore
    return await handler(request, context);
  },
} satisfies ExportedHandler<Cloudflare.Env>;