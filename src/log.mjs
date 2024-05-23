/**
 * Respond to the request
 * @param {Request} request
 */
export async function getLog(request) {
  const params = new URLSearchParams(request.url.replace(/^[^\?]+\?/, ""));

  let cursor = parseInt(params.get("cursor")) || 0;
  const offset = parseInt(params.get("offset")) || 0;
  let number = parseInt(params.get("number")) || 10;

  const te = new TextEncoder();

  const { readable, writable } = new TransformStream();

  const writer = writable.getWriter();

  const iv = setInterval(() => {
    writer.write(te.encode(`line ${offset + cursor++}\n`));
    if (number-- <= 0) {
      clearInterval(iv);
      writer.close();
    }
  }, 300);

  return new Response(readable /*, { status: 200 }*/);
}
