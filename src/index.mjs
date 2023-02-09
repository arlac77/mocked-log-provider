import { Router } from "itty-router";
import { error, json, missing } from "itty-router-extras";
import { createCors } from "itty-cors";

const { preflight, corsify } = createCors({ allowOrigin: "*" });

const router = Router();

router
  .all("*", preflight)
  .get("/version", () => json({ version: "0.2.0" }))
  .get("/", getLog)
  .all("*", () => missing("Are you sure about that?"));

export default {
  fetch(...args) {
    return router
      .handle(...args)
      .catch(err => error(500, err.stack))
      .then(corsify);
  }
};

/**
 * Respond to the request
 * @param {Request} request
 */
async function getLog(request) {
  const params = new URLSearchParams(request.url.replace(/^[^\?]+\?/, ""));

  let line = parseInt(params.get("cursor")) || 0;
  const offset = parseInt(params.get("offset")) || 0;
  const number = parseInt(params.get("number")) || 20;

  const te = new TextEncoder();

  const { readable, writable } = new TransformStream();

  const writer = writable.getWriter();

  const iv = setInterval(() => {
    writer.write(te.encode(`line ${offset + line++}\n`));
    if (line > number) {
      clearInterval(iv);
      writer.close();
    }
  }, 300);

  return new Response(readable, { status: 200 });
}
