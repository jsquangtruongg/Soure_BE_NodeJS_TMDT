import { json } from "express";
import Product from "../models/product.js";
import asyncHandler from "express-async-handler";
import slugify from "slugify";
import ProductCategory from "../models/ProductCategory.js";

export const createProduct = asyncHandler(async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ success: false, message: "Missing inputs" });
  }
  if (!req.body.title) {
    return res
      .status(400)
      .json({ success: false, message: "Title is required" });
  }

  req.body.slug = slugify(req.body.title, { lower: true });

  const existingProduct = await Product.findOne({ slug: req.body.slug });
  if (existingProduct) {
    return res
      .status(400)
      .json({ success: false, message: "Slug already exists" });
  }
  const { category } = req.body;
  const foundCategory = await ProductCategory.findById(category);
  if (!foundCategory) {
    return res
      .status(404)
      .json({ success: false, message: "Category not found" });
  }
  const newProduct = await Product.create(req.body);
  foundCategory.products.push(newProduct._id);
  await foundCategory.save();

  return res.status(201).json({
    success: true,
    message: "Product created successfully",
    product: newProduct,
  });
});

export const getProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const product = await Product.findById(pid);
  return res.status(200).json({
    success: product ? true : false,
    oneProductData: product ? product : "Cannot get Product",
  });
});

export const getAllProduct = asyncHandler(async (req, res) => {
  const queries = { ...req.query };

  const excludeFields = ["limit", "sort", "page", "fields"];
  excludeFields.forEach((el) => delete queries[el]);

  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (matchedEl) => `$${matchedEl}`
  );

  const formateQueries = JSON.parse(queryString);
  if (queries?.title)
    formateQueries.title = { $regex: queries.title, $options: "i" };

  const minPrice = parseFloat(queries.minPrice);
  const maxPrice = parseFloat(queries.maxPrice);

  if (!isNaN(minPrice) || !isNaN(maxPrice)) {
    formateQueries.price = {};
    if (!isNaN(minPrice)) {
      formateQueries.price.$gte = minPrice;
    }
    if (!isNaN(maxPrice)) {
      formateQueries.price.$lte = maxPrice;
    }
  }
  delete formateQueries.minPrice;
  delete formateQueries.maxPrice;

  let queryCommand = Product.find(formateQueries);

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
  const limit = req.query.limit || process.env.LIMIT_PRODUCT || 10;
  const skip = (page - 1) * limit;
  queryCommand.skip(skip).limit(limit);

  //Execute query
  //Số lượng sản phẩm thảo mãn điều kiên !== số lượng sp trả về một lần gọi API
  try {
    const response = await queryCommand;
    console.log(response);
    const counts = await Product.countDocuments(formateQueries);
    return res.status(200).json({
      success: true,
      productAllData: response.length ? response : [],
      counts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
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
export const addColorImages = asyncHandler(async (req, res) => {
  const { pid, color } = req.body;
  if (!pid || !color || !req.file) {
    return res.status(400).json({
      success: false,
      message:
        "Missing input data: Product ID, color, and images are required.",
    });
  }
  const image = req.file.path;
  const product = await Product.findById(pid);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }
  if (!product.colors) {
    product.colors = [];
  }
  const existingColor = product.colors.find((c) => c.color === color);
  if (existingColor) {
    existingColor.image = image;
  } else {
    product.colors.push({ color, image });
  }
  await product.save();
  return res.status(200).json({
    success: true,
    message: "Color and images added successfully",
    product,
  });
});

export const uploadVariants = asyncHandler(async (req, res) => {
  const { pid, variant_name, price } = req.body;

  const image = req.file.path;
  const product = await Product.findById(pid);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }
  if (!product.variants) {
    product.variants = [];
  }
  const existingVariants = product.variants.find(
    (c) => c.variant_name === variant_name
  );

  if (existingVariants) {
    existingVariants.price = price;
    existingVariants.image = image;
  } else {
    product.variants.push({ variant_name, price, image });
  }
  await product.save();
  return res.status(200).json({
    success: true,
    message: "Color and images added successfully",
    product,
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
    await Product.updateOne(
      {
        ratings: { $elemMatch: alreadyRatings },
      },
      { $set: { "ratings.$.star": star, "ratings.$.comment": comment } },
      { new: true }
    );
  } else {
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
export const uploadImagesProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  if (!req.files) throw new Error("Missing input");
  const response = await Product.findByIdAndUpdate(
    pid,
    {
      $push: { image: { $each: req.files.map((el) => el.path) } },
    },
    { new: true }
  );

  res.status(200).json({
    success: response ? true : false,
    uploadImagesProduct: response ? response : "Lỗi",
  });
});
