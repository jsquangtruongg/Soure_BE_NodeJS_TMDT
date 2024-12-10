import Product from "../models/product.js";
import asyncHandler from "express-async-handler";
import slugify from "slugify";

export const createProduct = asyncHandler(async (req, res) => {
  if (Object.keys(req.body).length === 0) throw new Error("Missing inputs");
  if (req.body && req.body.title) {
    req.body.slug = slugify(req.body.title);
  }
  const newProduct = await Product.create(req.body);
  return res.status(200).json({
    success: newProduct ? true : false,
    mes: newProduct ? newProduct : "Cannot create new product",
  });
});

export const getProduct = asyncHandler(async (req, res) => {    
  const { pid } = req.params;
  const product = await Product.findById(pid);
  return res.status(200).json({
    success: product ? true : false,
    productData: product ? product : "Cannot get Product",
  });
});

export const getAllProduct = asyncHandler(async (req, res) => {
  const queries = { ...req.query };
  //tách các trường đặt biệt ra khỏi query
  const excludeFields = ["limit", "sort", "page", "fields"];
  excludeFields.forEach((el) => delete queries[el]);

  //Format lại các operators cho đúng cú pháp của mongoose
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (matchedEl) => `$${matchedEl}`
  );
  const formateQueries = JSON.parse(queryString);
  if (queries?.title)
    formateQueries.title = { $regex: queries.title, $options: "i" };
  let queryCommand = Product.find(formateQueries);

  //Sorting

  //abc,efg=>[abc,efg]=> abc efg
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    queryCommand = queryCommand.sort(sortBy);
  }
  //Filed Limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    queryCommand = queryCommand.select(fields);
  }
  //Pagination

  //limit: số Object lấy về 1 gọi API
  //skip:2
  //1 2 3 ... 10
  //+2=2
  //+dsds=NaN
  const page = +req.query.page || 1;
  const limit = req.query.limit || process.env.LIMIT_PRODUCT;
  const skip = (page - 1) * limit;
  queryCommand.skip(skip).limit(limit);
  //Execute query
  //Số lượng sản phẩm thảo mãn điều kiên !== số lượng sp trả về một lần gọi API
  try {
    const response = await queryCommand;
    const counts = await Product.countDocuments(formateQueries);

    return res.status(200).json({
      success: response ? true : false,
      productAllData: response ? response : "Cannot getAll Product",
      counts,
    });
  } catch (error) {
    throw new Error(error);
  }
});
// Filtering

export const deleteProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  if (!pid) throw new Error("Missing Input");

  const response = await Product.findByIdAndDelete(pid);
  return res.status(200).json({
    success: response ? true : false,
    deleteProductData: response
      ? `Product with title ${response.title}has been deleted successfully`
      : " Cannot Delete Product",
  });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
  const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, {
    new: true,
  });
  return res.status(200).json({
    success: updatedProduct ? true : false,
    updatedProduct: updatedProduct ? updatedProduct : "Cannot update Product ",
  });
});

export const ratings = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, comment, pid } = req.body;

  if (!star || !pid) throw new Error("Missing input");

  const ratingProduct = await Product.findById(pid);
  const alreadyRatings = ratingProduct?.ratings?.find(
    (el) => el.postedBy.toString() === _id
  );

  if (alreadyRatings) {
    //update star & comment
    await Product.updateOne(
      {
        ratings: { $elemMatch: alreadyRatings },
      },
      { $set: { "ratings.$.star": star, "ratings.$.comment": comment } },
      { new: true }
    );
  } else {
    ///add star & comment
    await Product.findByIdAndUpdate(
      pid,
      {
        $push: { ratings: { star, comment, postedBy: _id } },
      },
      { new: true }
    );
  }

  const updatedProduct = await Product.findById(pid);
  const ratingCount = updatedProduct.ratings.length;
  const sumRatings = updatedProduct.ratings.reduce(
    (sum, el) => sum + +el.star,
    0
  );
  updatedProduct.totalRatings =
    Math.round((sumRatings * 10) / ratingCount) / 10;
  await updatedProduct.save();
  return res.status(200).json({
    status: true,
    updatedProduct,
  });
});
