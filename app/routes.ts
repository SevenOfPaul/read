import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home/index.tsx"),
  route("book/:bookId", "routes/book/index.tsx"),
  route("category/:categoryId", "routes/category/index.tsx"),
  route("author/:authorId", "routes/author/index.tsx"),
  route("special/:type", "routes/special/index.tsx"),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
