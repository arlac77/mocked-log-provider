import { AutoRouter } from "itty-router";
import { json } from "itty-router-extras";
import { createCors } from "itty-cors";
import { getLog, linesDelivered } from "./log.mjs";
import pkg from "../package.json" with { type: "json" };

const { preflight, corsify } = createCors({ allowOrigin: "*" });

const router = AutoRouter();

router
  .all("*", preflight)
  .get("/status", () => json({ linesDelivered, version: pkg.version }))
  .get("*", getLog);

export { router, corsify };
