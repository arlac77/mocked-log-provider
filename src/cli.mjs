#!/usr/bin/env -S node --no-warnings --title mocked-log-provider

import { createServerAdapter } from '@whatwg-node/server';
import { createServer } from "node:http";
import { router } from "./router.mjs";

/* See SD_LISTEN_FDS_START from
 * http://cgit.freedesktop.org/systemd/systemd/tree/src/systemd/sd-daemon.h */
const SD_LISTEN_FDS_START = 3;
let nextIndex = 0;

function systemdSocket(index) {
  if (arguments.length < 1) {
    index = nextIndex++;
  }

  if (process.env.LISTEN_FDS) {
    const listenFDs = parseInt(process.env.LISTEN_FDS, 10);
    if (listenFDs >= nextIndex) {
      return {
        fd: SD_LISTEN_FDS_START + index
      };
    }
  }
}

const ittyServer = createServerAdapter(router.fetch);
const httpServer = createServer(ittyServer);

let sd = { notify: (...argv) => {} };

try {
  sd = await import("sd-daemon");
  sd.notify("STATUS=starting");
} catch (e) {
  if (e.code === "ERR_MODULE_NOT_FOUND") {
  } else {
    console.error(e);
    process.exit(-1);
  }
}

const socket = systemdSocket() || 8888;

httpServer.listen(socket, error => {
  if (error) {
    sd.notify("READY=1\nERRNO=" + error);
  } else {
    sd.notify("READY=1\nSTATUS=running");
  }
});
