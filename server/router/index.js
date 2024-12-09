import userRouter from "./user.js";
import productRouter from "./product.js";
import { notFound, errorHandle } from "../middlewares/errHandler.js";
const initRouter = (app) => {
  app.use("/api/user", userRouter);
  app.use("/api/product", productRouter);
  app.use(notFound);
  app.use(errorHandle);
};

export default initRouter;
