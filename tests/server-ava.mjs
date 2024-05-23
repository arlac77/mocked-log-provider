import test from "ava";
import { createServerAdapter } from "@whatwg-node/server";
import { createServer } from "node:http";
import { router } from "../src/router.mjs";

test("response ok", async t => {
  const ittyServer = createServerAdapter(router.fetch);
  const httpServer = createServer(ittyServer);

  const socket = 8888;

  httpServer.listen(socket, error => {
    if (error) {
      console.error(error);
    }
  });

  const response = await fetch(`http://localhost:${socket}/?delay=1&number=2`);

  t.true(response.ok);

  httpServer.close();
  httpServer.unref();
});
