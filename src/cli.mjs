import impl from "./index.mjs";

import { createServer } from "node:http";

/* See SD_LISTEN_FDS_START from
 * http://cgit.freedesktop.org/systemd/systemd/tree/src/systemd/sd-daemon.h */
 const firstSystemdFD = 3;
 let nextIndex = 0;
 
 function systemdSocket(index) {
   if (arguments.length < 1) {
     index = nextIndex++;
   }
 
   if (!process.env.LISTEN_FDS) {
     return undefined;
   }
 
   const listenFDs = parseInt(process.env.LISTEN_FDS, 10);
   if (listenFDs < nextIndex) {
     return undefined;
   }
 
   return {
     fd: firstSystemdFD + index
   };
 }
 
const server = createServer((req, res) => {
  impl.fetch(req, res);
});

try {
  const sd = await import("sd-daemon");
  sd.notify("STATUS=starting");

  const socket = systemdSocket();
  console.log(socket);

  server.listen(socket, error => {
    if (error) {
      sd.notify("READY=1\nERRNO=" + error);
    } else {
      sd.notify("READY=1\nSTATUS=running");
    }
  });
} catch (e) {
  console.error(e);
}

