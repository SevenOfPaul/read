export function handleDataRequest(
  response: Response,
  {
    request,
    params,
    context,
  }:any
) {
  response.headers.set("X-Custom-Header", "value");
  return response;
}