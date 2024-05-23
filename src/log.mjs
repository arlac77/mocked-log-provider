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
  value = params.get("delay");
  let delay = value && parseInt(value) || 300;

  const te = new TextEncoder();

  const { readable, writable } = new TransformStream();

  const writer = writable.getWriter();

  const iv = setInterval(async () => {
    writer.write(te.encode(`line ${offset + cursor++}\n`));
    if (number-- <= 0) {
      clearInterval(iv);
      await writer.ready;
      await writer.close();
    }
  }, delay);

  return new Response(readable /*, { status: 200 }*/);
}
