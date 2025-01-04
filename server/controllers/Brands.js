import Brand from "../models/Brands.js";

import asyncHandler from "express-async-handler";

export const createBrand = asyncHandler(async (req, res) => {
  const { title } = req.body;
  if (!title) throw new Error("Missing Input");

  const newCreateBrand = await Brand.create(req.body);
  res.status(201).json({
    success: true,
    message: "Brand created successfully",
    data: newCreateBrand,
  });
});

export const deleteBrand = asyncHandler(async (req, res) => {
  const { rid } = req.params;
  const response = await Brand.findByIdAndDelete(rid);
  return res.status(200).json({
    success: response ? true : false,
    deleteBranData: response
      ? `Xóa ${response.title} thành công`
      : "Xóa thất bại",
  });
});

export const updateBrand = asyncHandler(async (req, res) => {
  const { rid } = req.params;
  const updateBrandData = await Brand.findByIdAndUpdate(rid, req.body, {
    new: true,
  });
  return res.status(200).json({
    success: updateBrandData ? true : false,
    updateBrand: updateBrandData ? updateBrandData : "Cannot UpdateBrand",
  });
});
export const getOneBrand = asyncHandler(async (req, res) => {
  const { rid } = req.params;
  const response = await Brand.findById(rid).populate({
    path: "category",
    populate: {
      path: "products",
      model: "Product",
    },
  });

  return res.status(200).json({
    success: response ? true : false,
    oneBrand: response ? response : "Cannot getAllBrand",
  });
});

export const getAllBrand = asyncHandler(async (req, res) => {
  const response = await Brand.find().populate({
    path: "category",
    populate: {
      path: "products",
      model: "Product",
    },
  });
  return res.status(200).json({
    success: response ? true : false,
    mess: response ? response : "Cannot getAllBrand",
  });
});

export const uploadImageBrand = asyncHandler(async (req, res) => {
  const { rid } = req.params;
  if (!req.file) throw new Error("Missing input");
  const response = await Brand.findByIdAndUpdate(
    rid,
    {
      $push: { image: { $each: req.files.map((el) => el.path) } },
    },
    { new: true }
  );
  res.status().json({
    success: response ? true : false,
    mess: response ? response : "Cannot UploadImage",
  });
});
