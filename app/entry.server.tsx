import { renderToString } from "react-dom/server";
import type { AppLoadContext, EntryContext } from "react-router";
import { ServerRouter } from "react-router";

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  loadContext: AppLoadContext
) {
  const html = renderToString(
    <ServerRouter context={remixContext} url={request.url} />
  );

  return new Response(html, {
    status: responseStatusCode,
    headers: {
      ...responseHeaders,
      "Content-Type": "text/html",
    },
  });
}
