import { AutoRouter } from "itty-router";
import { json, missing } from "itty-router-extras";
import { createCors } from "itty-cors";
import { getLog } from "./log.mjs";

const { preflight, corsify } = createCors({ allowOrigin: "*" });

const router = AutoRouter();

router
  .all("*", preflight)
  .get("/version", () => json({ version: "0.4.0" }))
  .get("/", getLog)
  .all("*", () => missing("Are you sure about that?"));

export { router, corsify };
