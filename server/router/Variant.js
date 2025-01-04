import express from "express";
import * as controllers from "../controllers/Variant.js";
import { verifyAccessToken, isAdmin } from "../middlewares/verifyToken.js";

const router = express.Router();
router.post("/", [verifyAccessToken, isAdmin], controllers.createVariant);

router.get("/", controllers.getAllVariant);
router.get("/:vid", controllers.getOneVariant);

export default router;
