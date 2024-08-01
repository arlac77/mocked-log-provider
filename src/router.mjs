import { AutoRouter } from "itty-router";
import { json, missing } from "itty-router-extras";
import { createCors } from "itty-cors";
import { getLog } from "./log.mjs";
import pkg from "../package.json" with { type: "json" };

const { preflight, corsify } = createCors({ allowOrigin: "*" });

const router = AutoRouter();

router
  .all("*", preflight)
  .get("/version", () => json({ version: pkg.version }))
  .get("/", getLog)
  .all("*", () => missing("Are you sure about that?"));

export { router, corsify };
