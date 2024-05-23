import { error } from "itty-router-extras";
import { router, corsify } from "./router.mjs";

export default {
  fetch(...args) {
    return router
      .handle(...args)
      .catch(err => error(500, err.stack))
      .then(corsify);
  }
};
