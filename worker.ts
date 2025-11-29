import {
  createRequestHandler,
  RouterContextProvider,
} from "react-router";

declare module "react-router" {
  export interface AppLoadContext {
    cloudflare: {
      env: Env;
      ctx: ExecutionContext;
    };
  }
}

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE,
);

export default {
  async fetch(request, env, ctx) {
    const contextValue = {
      cloudflare: {
        env,
        ctx,
      },
    };
    return requestHandler(request);
  },
} satisfies ExportedHandler<Env>;