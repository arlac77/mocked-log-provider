import impl from "./index.mjs";

import { createServer } from "node:http";

const server = createServer((req, res) => {
  impl.fetch(req, res);
});

let port = "/run/mocked-log-provider/http/socket";

server.listen(port);
