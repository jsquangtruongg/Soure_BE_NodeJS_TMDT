export const notFound = (req, res, next) => {
  const error = new Error(
    `Không tìm thấy đường dẫn ${req.originalUrl} notFound`
  );
  res.status(404);
  next(error);
};

export const errorHandle = (error, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  return res.status(statusCode).json({
    success: false,
    mes: error?.message,
  });
};
