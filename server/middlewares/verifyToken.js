import jwt from "jsonwebtoken";

import asyncHandler from "express-async-handler";

export const verifyAccessToken = asyncHandler(async (req, res, next) => {
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err)
        return res.status(401).json({
          success: false,
          mes: "Lỗi Token",
        });
      req.user = decode;
      next();
    });
  } else {
    return res.status(401).json({
      success: false,
      mes: "gửi lại token",
    });
  }
});

export const isAdmin = asyncHandler((req, res, next) => {
  const { role } = req.user;
  if (role !== "admin") {
    return res.status(401).json({
      success: false,
      mes: "không phải role Admin",
    });
  }
  next();
});
