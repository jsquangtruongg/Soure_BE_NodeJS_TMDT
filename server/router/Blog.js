import express from "express";
import * as controllers from "../controllers/Blog.js";
import { verifyAccessToken, isAdmin } from "../middlewares/verifyToken.js";
import uploadCloud from "../config/cloudinary.config.js";

const router = express.Router();

router.get("/", controllers.getAllBlog);
router.get("/oneBlog/:lid", controllers.getBlog);

router.put("/like/:lid", [verifyAccessToken], controllers.likeBlog);
router.put("/dislike/:lid", verifyAccessToken, controllers.disLikeBlog);

router.post("/", [verifyAccessToken, isAdmin], controllers.createBlog);
router.put(
  "/updateImageBlog/:lid",
  [verifyAccessToken, isAdmin],
  uploadCloud.single("image"),
  controllers.updateImageBlog
);
router.put(
  "/update/:lid",
  [verifyAccessToken, isAdmin],
  controllers.updateBlog
);
router.delete("/:lid", [verifyAccessToken, isAdmin], controllers.deleteBlog);
export default router;
