import userRouter from "./user.js";
import productRouter from "./product.js";
import productCategoryRouter from "./ProductCategory.js";
import blogCategoryRouter from "./BlogCategory.js";

import { notFound, errorHandle } from "../middlewares/errHandler.js";
const initRouter = (app) => {
  app.use("/api/user", userRouter);
  app.use("/api/product", productRouter);
  app.use("/api/productCategory", productCategoryRouter);
  app.use("/api/blogCategory", blogCategoryRouter);

  app.use(notFound);
  app.use(errorHandle);
};

export default initRouter;
