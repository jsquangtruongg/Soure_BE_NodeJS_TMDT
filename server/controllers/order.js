import { json } from "express";
import Order from "../models/order.js";
import User from "../models/user.js";
import asyncHandler from "express-async-handler";
import Coupon from "../models/Coupont.js";

export const createOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { coupon } = req.body;
  const userCart = await User.findById(_id)
    .select("cart")
    .populate("cart.product", "title price");

  const products = userCart?.cart?.map((el) => ({
    product: el.product._id,
    count: el.quantity,
    color: el.color,
  }));
  let total = userCart?.cart?.reduce(
    (sum, el) => el.product.price * el.quantity + sum,
    0
  );
  const createData = { products, total, orderBy: _id };
  if (coupon) {
    const selectedCoupon = await Coupon.findById(coupon);
    total =
      Math.round((total * (1 - selectedCoupon?.discount / 100)) / 1000) *
        1000 || total;
    createData.total = total;
    createData.coupon = coupon;
  }

  const rs = await Order.create(createData);
  return res.status(200).json({
    success: rs ? true : false,
    rs: rs ? rs : "Cannot create new Order",
    userCart,
  });
});

export const updateStatusOrder = asyncHandler(async (req, res) => {
  const { oid } = req.params;
  const { status } = req.body;
  if (!status) throw new Error("Missing Status");

  const response = await Order.findByIdAndUpdate(
    oid,
    { status },
    { new: true }
  );
  return res.status(200).json({
    success: response ? true : false,
    response: response ? response : "Cannot create new Order",
  });
});

export const getOneUserOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  const response = await Order.find({ orderBy: _id });
  return res.status(200).json({
    success: response ? true : false,
    response: response ? response : "Cannot create new Order",
  });
});

export const getAllUserOrder = asyncHandler(async (req, res) => {
  const response = await Order.find();
  return res.status(200).json({
    success: response ? true : false,
    response: response ? response : "Cannot create new Order",
  });
});
