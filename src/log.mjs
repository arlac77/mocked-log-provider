/**
 * Respond to the request
 * @param {Request} request
 */
export async function getLog(request) {
  const params = new URLSearchParams(request.url.replace(/^[^\?]+\?/, ""));

  let value = params.get("cursor");
  let cursor = value && parseInt(value) || 0;
  value = params.get("offset");
  const offset = value && parseInt(value) || 0;
  value = params.get("number");
  let number = value && parseInt(value) || 10;

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
