import Router from "@koa/router";
import * as placeController from "../controllers/place.controller";
import {
  validate,
  validateCreatePlace,
  validateUpdatePlace,
  validateSearchParams,
  validateBulkImport,
} from "../middleware/validation.middleware";
import { authMiddleware } from "../middleware/auth.middleware";
import koaBody from "koa-body";
import bodyParser from "koa-bodyparser";

// Create router
const router = new Router({ prefix: "/api/places" });

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Get all places
router.get(
  "/",
  validate(validateSearchParams, "query"),
  placeController.getPlaces,
);

// Search places
router.get(
  "/search",
  validate(validateSearchParams, "query"),
  placeController.searchPlaces,
);

// Get a place by ID
router.get("/:id", placeController.getPlaceById);

// Create a new place
router.post("/", validate(validateCreatePlace), placeController.createPlace);

// Update a place
router.put(
  "/:id",
  bodyParser({}),
  validate(validateUpdatePlace),
  placeController.updatePlace,
);

// Delete a place
router.delete("/:id", placeController.deletePlace);

// Bulk import places
router.post(
  "/bulk-import",
  bodyParser({}),
  validate(validateBulkImport),
  placeController.bulkImportPlaces,
);

// Bulk form file import places
router.post(
  "/file-import",
  koaBody({
    formidable: { maxFieldsSize: 1024 * 1024 * 10 },
    formLimit: 1024 * 1024 * 10,
    jsonLimit: 1024 * 1024 * 10,
    encoding: "UTF-8",
    multipart: true,
  }),
  placeController.fileImportPlaces,
);

export default router;
