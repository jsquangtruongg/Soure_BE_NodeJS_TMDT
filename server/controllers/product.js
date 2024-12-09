import { json } from "express";
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
  const Products = await Product.find();
  return res.status(200).json({
    success: Products ? true : false,
    productAllData: Products ? Products : "Cannot getAll Product",
  });
});

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
