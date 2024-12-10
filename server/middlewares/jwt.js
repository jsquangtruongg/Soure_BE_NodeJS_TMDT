import jwt from "jsonwebtoken";

export const generateAccessToken = (uid, role) => {
  return jwt.sign({ _id: uid, role }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });
};

export const generateRefreshToken = (uid) => {
  return jwt.sign({ _id: uid }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};
