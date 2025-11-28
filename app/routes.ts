import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home/index.tsx"),
  route("book/:bookId", "routes/book/index.tsx"),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
