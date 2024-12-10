import express from "express";
import * as controllers from "../controllers/BlogCategory.js";
import { verifyAccessToken, isAdmin } from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/", controllers.getAllBlogCategory);
router.post("/", [verifyAccessToken, isAdmin], controllers.createBlogCategory);
router.delete(
  "/:bid",
  [verifyAccessToken, isAdmin],
  controllers.deleteBlogCategory
);
router.put(
  "/:bid",
  [verifyAccessToken, isAdmin],
  controllers.updateBlogCategory
);
export default router;
