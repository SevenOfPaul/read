import type { BlogManifest } from "lib/vite-plugin-blog-manifest/types";

declare module "virtual:blog-manifest" {
  const manifest: BlogManifest;
  export default manifest;
}