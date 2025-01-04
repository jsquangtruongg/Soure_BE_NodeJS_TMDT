import express from "express";
import * as controllers from "../controllers/Brands.js";
import { verifyAccessToken, isAdmin } from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/", controllers.getAllBrand);
router.get("/:rid", controllers.getOneBrand);

router.post("/", [verifyAccessToken, isAdmin], controllers.createBrand);
router.delete("/:rid", [verifyAccessToken, isAdmin], controllers.deleteBrand);
router.put("/:rid", [verifyAccessToken, isAdmin], controllers.updateBrand);
export default router;
