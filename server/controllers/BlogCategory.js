import BlogCategory from "../models/BlogCategory.js";
import asyncHandler from "express-async-handler";
export const createBlogCategory = asyncHandler(async (req, res) => {
  const newCreateBlogProduct = await BlogCategory.create(req.body);
  return res.status(200).json({
    success: newCreateBlogProduct ? true : false,
    newCreateBlogProductData: newCreateBlogProduct
      ? newCreateBlogProduct
      : "Cannot new Create Blog Category",
  });
});

export const deleteBlogCategory = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  const response = await BlogCategory.findByIdAndDelete(bid);
  return res.status(200).json({
    success: response ? true : false,
    mess: response ? `đã xóa ${response.title} thành công` : "Xóa thất bại",
  });
});

export const updateBlogCategory = asyncHandler(async (req, res) => {
  const { bid } = req.params;

  const updateBlogCategoryDate = await BlogCategory.findByIdAndUpdate(
    bid,
    req.body,
    { new: true }
  );
  return res.status(200).json({
    success: updateBlogCategoryDate ? true : false,
    updateBlogCategory: updateBlogCategoryDate
      ? updateBlogCategoryDate
      : "Cannot Update Blog Category",
  });
});

export const getAllBlogCategory = asyncHandler(async (req, res) => {
  const updateAllBlogCategoryData = await BlogCategory.find().select(
    "title _id"
  );
  return res.status(200).json({
    success: updateAllBlogCategoryData ? true : false,
    getAllBlogCategory: updateAllBlogCategoryData
      ? updateAllBlogCategoryData
      : "Cannot Get All Blog Category",
  });
});
