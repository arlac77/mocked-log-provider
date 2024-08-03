/**
 * Respond to the request
 * @param {Request} request
 */
export async function getLog(request) {
  try {
    const params = new URLSearchParams(request.url.replace(/^[^\?]+\?/, ""));
    const param = (attribute, d = 0) => {
      const value = params.get(attribute);
      return (value !== null && parseInt(value)) || d;
    };

    let cursor = param("cursor", 0);
    const offset = param("offset", 0);
    let number = param("number", 10);
    let delay = param("delay", 200);

    const te = new TextEncoder();

    const { readable, writable } = new TransformStream();

    const writer = writable.getWriter();

    const iv = setInterval(async () => {
      writer.write(te.encode(`line ${offset + cursor++}\n`));
      if (number-- <= 0) {
        clearInterval(iv);
        await writer.close();
      }
    }, delay);

    return new Response(readable, {
      headers: { "Content-Type": "text/plain" },
      status: 200
    });
  } catch (e) {
    console.error(e);
    return new Response(e.message, {
      headers: { "Content-Type": "text/plain" },
      status: 500
    });
  }
}
