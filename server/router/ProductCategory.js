import express from "express";
import * as controller from "../controllers/ProductCategory.js";
import { verifyAccessToken, isAdmin } from "../middlewares/verifyToken.js";

const router = express.Router();
router.get("/", [verifyAccessToken, isAdmin], controller.getAllProductCategory);

router.post(
  "/",
  [verifyAccessToken, isAdmin],
  controller.createNewProductCategory
);
router.delete(
  "/:cid",
  [verifyAccessToken, isAdmin],
  controller.deleteProductCategory
);
router.put(
  "/:cid",
  [verifyAccessToken, isAdmin],
  controller.updatedProductCategory
),
  router.get("/:cid", controller.getProductCategory);

export default router;
