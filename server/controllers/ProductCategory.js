import ProductCategory from "../models/ProductCategory.js";
import asyncHandler from "express-async-handler";


export const createNewProductCategory = asyncHandler(async (req, res) => {
  const newProductCategory = await ProductCategory.create(req.body);
  return res.status(200).json({
    success: newProductCategory ? true : false,
    newProductCategory: newProductCategory
      ? newProductCategory
      : "Cannot create newProductCategory",
  });
});

export const deleteProductCategory = asyncHandler(async (req, res) => {
  const { cid } = req.params;
  if (!cid) throw new Error("Missing Input");

  const response = await ProductCategory.findByIdAndDelete(cid);

  return res.status(200).json({
    success: response ? true : false,
    deleteProductCategory: response
      ? `Product with title ${response.title} deleted successfully`
      : "Cannot delete Product",
  });
});

export const updatedProductCategory = asyncHandler(async (req, res) => {
  const { cid } = req.params;
  const response = await ProductCategory.findByIdAndUpdate(cid, req.body, {
    new: true,
  });
  return res.status(200).json({
    success: response ? true : false,
    updatedProductCategoryDât: response ? response : "Cannot Update failure ",
  });
});

export const getProductCategory = asyncHandler(async (req, res) => {
  const { cid } = req.params;
  const getProductCategory = await ProductCategory.findById(cid);
  console.log(getProductCategory?.id);
  return res.status(200).json({
    success: getProductCategory ? true : false,
    getProductCategoryData: getProductCategory
      ? getProductCategory
      : "Cannot get a ProductCategory",
  });
});

export const getAllProductCategory = asyncHandler(async (req, res) => {
  const response = await ProductCategory.find().select("title _id");
  return res.status(200).json({
    success: response ? true : false,
    getAllProductCategoryData: response
      ? response
      : "Cannot a ProductCategoryAll",
  });
});

