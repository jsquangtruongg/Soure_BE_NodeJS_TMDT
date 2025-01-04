import Coupon from "../models/Coupont.js";
import asyncHandler from "express-async-handler";

export const createCoupon = asyncHandler(async (req, res) => {
  const { name, discount, expiry } = req.body;
  if (!name || !discount || !expiry) throw new Error("Missing Input");

  const newCreateCoupon = await Coupon.create({
    ...req.body,
    expiry: Date.now() + +expiry * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    success: newCreateCoupon ? true : false,
    newCreateCouponDate: newCreateCoupon
      ? newCreateCoupon
      : "Cannot create Coupon",
  });
});

export const deleteCoupon = asyncHandler(async (req, res) => {
  const { cid } = req.params;
  const response = await Coupon.findByIdAndDelete(cid);
  return res.status(200).json({
    success: response ? true : false,
    mes: response ? `đã xóa thành công${response.name}` : "Xóa thất bại",
  });
});

export const updateCoupon = asyncHandler(async (req, res) => {
  const { cid } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error("Missing input");
  if (req.body.expiry)
    req.body.expiry = Date.now() + +req.body.expiry * 24 * 60 * 60 * 1000;
  const updateCouponDate = await Coupon.findByIdAndUpdate(cid, req.body, {
    new: true,
  });
  return res.status(200).json({
    success: updateCouponDate ? true : false,
    updateCoupon: updateCouponDate
      ? updateCouponDate
      : "Cannot updateCouponDate",
  });
});
export const getOneCoupon = asyncHandler(async (req, res) => {
  const { cid } = req.params;
  const response = await Coupon.findById(cid);
  return res.status(200).json({
    success: response ? true : false,
    mess: response ? response : "Cannot getOneCoupon",
  });
});

export const getAllCoupon = asyncHandler(async (req, res) => {
  const response = await Coupon.find().select("-createdAt -updatedAt ");
  return res.status(200).json({
    success: response ? true : false,
    mess: response ? response : "Cannot getAllCoupon",
  });
});
