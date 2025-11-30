import type { EntryContext } from "react-router";
import { renderToReadableStream } from "react-dom/server";
import { isbot } from "isbot";

/**
 * 适用于 Cloudflare Pages 的服务器入口文件
 * 处理服务器端渲染 (SSR) 请求
 */
export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const body = await renderToReadableStream(
    <html lang="zh-CN">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>夜读小说网</title>
      </head>
      <body>
        <div id="root">
          {/* 使用基本的div来占位，客户端渲染将替换此内容 */}
          <div>Loading...</div>
        </div>
      </body>
    </html>,
    {
      signal: request.signal,
      onError(error) {
        console.error(error);
        responseStatusCode = 500;
      },
    }
  );

  if (isbot) {
    await body.allReady;
  }

  responseHeaders.set("Content-Type", "text/html");
  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
