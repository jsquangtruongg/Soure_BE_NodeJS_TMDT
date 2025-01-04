import express from "express";
import * as controllers from "../controllers/order.js";
import { verifyAccessToken, isAdmin } from "../middlewares/verifyToken.js";

const router = express.Router();
router.get("/", [verifyAccessToken], controllers.getOneUserOrder);
router.get(
  "/get-all-order",
  [verifyAccessToken, isAdmin],
  controllers.getAllUserOrder
);

router.post("/", [verifyAccessToken], controllers.createOrder);
router.put(
  "/status/:oid",
  [verifyAccessToken, isAdmin],

  controllers.updateStatusOrder
);

export default router;
