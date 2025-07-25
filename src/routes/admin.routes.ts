import Router from "@koa/router";
import { authMiddleware } from "../middleware/auth.middleware";
import runMigrations from "../db/migrations/run-migrations";
import bodyParser from "koa-bodyparser";

// Create router
const router = new Router({ prefix: "/api/admin" });

// Apply authentication middleware to all routes
router.use(bodyParser({}));
router.use(authMiddleware);

// Get all places
router.post("/migrate", async (ctx) => {
  try {
    await runMigrations();
    ctx.status = 200;
    ctx.body = { message: "OK chef" };
  } catch (error) {
    ctx.status = 500;
    ctx.body = error;
  }
});

export default router;
