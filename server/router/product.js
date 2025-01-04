import express from "express";
import * as controllers from "../controllers/product.js";
import { verifyAccessToken, isAdmin } from "../middlewares/verifyToken.js";
import uploadCloud from "../config/cloudinary.config.js";

const router = express.Router();

router.post("/", [verifyAccessToken, isAdmin], controllers.createProduct);
router.get("/", [verifyAccessToken, isAdmin], controllers.getAllProduct);
router.put("/ratings", verifyAccessToken, controllers.ratings);

//=========================//
router.put(
  "/uploadimage/:pid",
  uploadCloud.array("img", 10),
  controllers.uploadImagesProduct
),
  router.put(
    "/add-color-images",
    [verifyAccessToken, isAdmin],
    uploadCloud.single("image"),
    controllers.addColorImages
  );
router.put(
  "/add-variant-images",
  [verifyAccessToken, isAdmin],
  uploadCloud.single("image"),
  controllers.uploadVariants
);
router.put("/:pid", [verifyAccessToken, isAdmin], controllers.updateProduct);
router.delete("/:pid", [verifyAccessToken, isAdmin], controllers.deleteProduct);
router.get("/oneProduct/:pid", controllers.getProduct);
export default router;
