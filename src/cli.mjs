import impl from "./index.mjs";

import { createServer } from "node:http";

const server = createServer((req, res) => {
  impl.fetch(req, res);
});


server.listen(1337);
