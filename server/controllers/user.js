import { hash } from "bcrypt";
import User from "../models/user.js";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../middlewares/jwt.js";
import { sendMail } from "../ultils/sendemail.js";

export const register = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({
      success: false,
      mes: "Thiếu trường nhập liệu",
    });
  }
  const user = await User.findOne({ email: email });
  if (user) {
    throw new Error("Tài khoản đã tồn tại");
  } else {
    const newUser = await User.create(req.body);
    return res.status(200).json({
      success: newUser ? true : false,
      mes: newUser ? `Đăng kí thành công ${newUser}` : "Đang lỗi gì đó ",
    });
  }
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      mes: "Thiếu trường nhập liệu",
    });
  }
  const response = await User.findOne({ email: email });

  if (response && (await response.isCorrectPassword(password))) {
    //tách password và role khỏi response
    const { password, role, refreshToken, ...userData } = response.toObject();
    //tạo accessToken
    const accessToken = generateAccessToken(response._id, role);
    //lưu refreshToken
    const newRefreshToken = generateRefreshToken(response._id);

    //Lưu refreshToken vào database
    await User.findByIdAndUpdate(
      response._id,
      { refreshToken: newRefreshToken },
      { new: true }
    );

    // lưu refreshToken vào cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 1000,
    });
    return res.status(200).json({
      success: true,
      accessToken,
      userData,
    });
  } else {
    throw new Error("Xác thực không hợp lệ ");
  }
});

export const getCurrent = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  const user = await User.findById({ _id }).select(
    "-refreshToken  -password -role"
  );
  return res.status(200).json({
    success: user ? true : false,
    rs: user ? user : "User not Found ",
  });
});

export const refreshAccessToken = asyncHandler(async (req, res, next) => {
  // lấy token từ cookies
  const cookie = req.cookies;
  //check xem có token hay không
  if (!cookie && !cookie.refreshToken)
    throw new Error("Không có token ở trong cooki");
  const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET);
  const response = await User.findById({
    _id: rs._id,
    refreshToken: cookie.refreshToken,
  });
  return res.status(200).json({
    success: response ? true : false,
    newAccessToken: response
      ? generateAccessToken(response._id, response.role)
      : "token không khớp",
  });
});

export const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie || !cookie.refreshToken)
    throw new Error("chưa có refreshToken trong cookie");
  // xóa refreshToken ở DB
  await User.findOneAndUpdate(
    { refreshToken: cookie.refreshToken },
    { refreshToken: "" },
    { new: true }
  );
  //xóa refreshToken ở cookie trình duyệt
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  return res.status(200).json({
    success: true,
    mes: "LogOut đã xong",
  });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.query;
  if (!email) throw new Error("Không có email");
  const user = await User.findOne({ email });
  if (!user) throw new Error("Email này không hợp lệ");

  const resetToken = user.createPasswordChangeToken();
  await user.save();

  const html = `Xin vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn!.Link này sẽ hết hạn sau 10 phút kể từ bây giờ <a href=${process.env.URL_SERVER}/api/user/reset-password/${resetToken}> Nhấn vào đây!</a> `;
  console.log(html);
  const data = {
    email,
    html,
  };

  const rs = await sendMail(data);
  console.log(rs);
  return res.status(200).json({
    success: true,
    rs,
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { password, token } = req.body;
  if (!password || !token) throw new Error("Thiếu trường nhập");

  const passwordResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error("Invalid reset token");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.passwordChangedAt = Date.now();
  await user.save();
  return res.status(200).json({
    success: user ? true : false,
    mes: user ? "Updated password" : "Something went wrong",
  });
});

export const getUsers = asyncHandler(async (req, res) => {
  const response = await User.find();
  return res.status(200).json({
    success: response ? true : false,
    users: response,
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { _id } = req.query;
  if (!_id) throw new Error("Missing input");

  const response = await User.findByIdAndDelete(_id);
  return res.status(200).json({
    success: response ? true : false,
    deleteUser: response
      ? `User with email ${response.email}`
      : "không thể xóa user",
  });
});

export const updateUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  if (!_id || Object.keys(req.body).length === 0)
    throw new Error("Missing input");

  const response = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  }).select("-password -role -refreshToken");
  return res.status(200).json({
    success: response ? true : false,
    deleteUser: response ? response : "some thing went wrong",
  });
});

export const updateUserByAdmin = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error("Missing input");

  const response = await User.findByIdAndUpdate(uid, req.body, {
    new: true,
  }).select("-password -role -refreshToken");
  return res.status(200).json({
    success: response ? true : false,
    deleteUser: response ? response : "some thing went wrong",
  });
});

export const updateUserAddress = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  if (!req.body.address) throw new Error("Missing input");
  const response = await User.findByIdAndUpdate(
    _id,
    { $push: { address: req.body.address } },
    {
      new: true,
    }
  );
  return res.status(200).json({
    success: response ? true : false,
    updateUserAddress: response ? response : "Cannot update Address",
  });
});

export const updateCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { pid, quantity, color } = req.body;
  if (!pid || !quantity || !color) throw new Error("Missing input");

  const user = await User.findById(_id).select("cart");
  const alreadyProduct = user?.cart.find((el) => el.product.toString() === pid);
  if (alreadyProduct) {
    if (alreadyProduct.color === color) {
      const response = await User.updateOne(
        {
          cart: { $elemMatch: alreadyProduct },
        },
        { $set: { "cart.$.quantity": quantity } },
        { new: true }
      );
      return res.status(200).json({
        success: response ? true : false,
        updateUserAddress: response ? response : "Cannot update Address",
      });
    } else {
      const response = await User.findByIdAndUpdate(
        _id,
        { $push: { cart: { product: pid, quantity, color } } },
        { new: true }
      );
      return res.status(200).json({
        success: response ? true : false,
        updateUserAddress: response ? response : "Cannot update Address",
      });
    }
  } else {
    const response = await User.findByIdAndUpdate(
      _id,
      { $push: { cart: { product: pid, quantity, color } } },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      updateUserAddress: response ? response : "Cannot update Address",
    });
  }
});
