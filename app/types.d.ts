/// <reference types="vite/client" />

// 声明虚拟模块
declare module "virtual:react-router/server-build" {
  import type { ServerBuild } from "react-router";
  const build: ServerBuild;
  export default build;
}

declare module "virtual:react-router/client-build" {
  const build: any;
  export default build;
}
