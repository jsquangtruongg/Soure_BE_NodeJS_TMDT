import express from "express";

import * as controllers from "../controllers/user.js";
import { verifyAccessToken, isAdmin } from "../middlewares/verifyToken.js";
const router = express.Router();

router.post("/register", controllers.register);
router.post("/login", controllers.login);
router.get("/current", verifyAccessToken, controllers.getCurrent);
router.post("/refreshtoken", controllers.refreshAccessToken);
router.get("/logout", controllers.logout);
router.get("/forgotPassword", controllers.forgotPassword);
router.put("/reset-password", controllers.resetPassword);
router.get("/", [verifyAccessToken, isAdmin], controllers.getUsers);
router.delete("/", [verifyAccessToken, isAdmin], controllers.deleteUser);
router.put("/current", [verifyAccessToken], controllers.updateUser);
router.put(
  "/:uid",
  [verifyAccessToken, isAdmin],
  controllers.updateUserByAdmin
);

export default router;
