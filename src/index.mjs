import { Router } from "itty-router";
import { error, json, missing } from "itty-router-extras";
import { createCors } from "itty-cors";

const { preflight, corsify } = createCors();

const router = Router();

// register v2 API plus all routes
router
  .all("*", preflight) // handle CORS preflight/OPTIONS requests
  .get("/version", () => json({ version: "0.1.0" })) // GET release version
  .get("/stuff", () => json(["foo", "bar", "baz"])) // GET some other random stuff
  .all("*", () => missing("Are you sure about that?")); // 404 for all else

export default {
  fetch: (...args) =>
    router
      .handle(...args)
      .catch(err => error(500, err.stack))
      .then(corsify)
};
