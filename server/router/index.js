import userRouter from "./user.js";
import productRouter from "./product.js";
import productCategoryRouter from "./ProductCategory.js";
import blogCategoryRouter from "./BlogCategory.js";
import blog from "./Blog.js";
import brand from "./Brands.js";
import Coupon from "./Coupon.js";
import order from "./order.js";
import variant from './Variant.js'
import { notFound, errorHandle } from "../middlewares/errHandler.js";
const initRouter = (app) => {
  app.use("/api/user", userRouter);
  app.use("/api/product", productRouter);
  app.use("/api/productCategory", productCategoryRouter);
  app.use("/api/blogCategory", blogCategoryRouter);
  app.use("/api/blog", blog);
  app.use("/api/brand", brand);
  app.use("/api/coupon", Coupon);
  app.use("/api/order", order);
  app.use("/api/variant",variant);

  app.use(notFound);
  app.use(errorHandle);
};

export default initRouter;
