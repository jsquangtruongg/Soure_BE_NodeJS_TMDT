import express from "express";
import * as controllers from "../controllers/Coupon.js";
import { verifyAccessToken, isAdmin } from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/", controllers.getAllCoupon);
router.get("/:cid", controllers.getOneCoupon);

router.post("/", [verifyAccessToken, isAdmin], controllers.createCoupon);
router.delete("/:cid", [verifyAccessToken, isAdmin], controllers.deleteCoupon);
router.put("/:cid", [verifyAccessToken, isAdmin], controllers.updateCoupon);
export default router;
