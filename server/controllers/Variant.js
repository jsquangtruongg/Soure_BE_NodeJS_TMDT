import Variant from "../models/Variant.js";
import Product from "../models/product.js";
import asyncHandler from "express-async-handler";

export const createVariant = asyncHandler(async (req, res) => {
  const { ram_name, productId } = req.body;

  if (!ram_name || !productId) {
    return res
      .status(400)
      .json({ success: false, message: "Missing input fields" });
  }

  try {
    const newVariant = await Variant.create(req.body);
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $push: { variants: newVariant._id } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Variant created and added to product successfully",
      product: updatedProduct,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export const getOneVariant = asyncHandler(async (req, res) => {
  const { vid } = req.params;
  const response = await Variant.findById(vid).populate({
    path: "productId",
  });

  return res.status(200).json({
    success: true,
    mess: response ? response : "Goi thai bai",
  });
});

export const getAllVariant = asyncHandler(async (req, res) => {
  const response = await Variant.bind();

  return res.status().json({
    success: true,
    mess: response ? response : "Goi thai bai",
  });
});
