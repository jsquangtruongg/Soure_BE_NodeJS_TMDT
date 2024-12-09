import express from "express";
import * as controllers from "../controllers/product.js";
import { verifyAccessToken, isAdmin } from "../middlewares/verifyToken.js";
const router = express.Router();

router.post("/", [verifyAccessToken, isAdmin], controllers.createProduct);

router.get("/", [verifyAccessToken, isAdmin], controllers.getAllProduct);
router.put("/:pid", [verifyAccessToken, isAdmin], controllers.updateProduct);
router.delete("/:pid", [verifyAccessToken, isAdmin], controllers.deleteProduct);
router.get("/:pid", controllers.getProduct);
export default router;
