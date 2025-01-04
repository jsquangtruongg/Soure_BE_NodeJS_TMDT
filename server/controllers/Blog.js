import { json } from "express";
import Blog from "../models/Blog.js";
import asyncHandler from "express-async-handler";

export const createBlog = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;
  if (!title || !description || !category) throw new Error("Missing Input");

  const newCreateBlogData = await Blog.create(req.body);
  return res.status(200).json({
    success: newCreateBlogData ? true : false,
    newCreateBlogData: newCreateBlogData
      ? newCreateBlogData
      : "Cannot create new Blog",
  });
});

export const updateBlog = asyncHandler(async (req, res) => {
  const { lid } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error("Missing Input");

  const updateBlogDate = await Blog.findByIdAndUpdate(lid, req.body, {
    new: true,
  });
  return res.status(200).json({
    success: updateBlogDate ? true : false,
    newUpdateBlogData: updateBlogDate ? updateBlogDate : "Cannot Update Blog",
  });
});

export const getAllBlog = asyncHandler(async (req, res) => {
  const getAllBlogData = await Blog.find();
  return res.status(200).json({
    success: getAllBlogData ? true : false,
    getAllBlog: getAllBlogData ? getAllBlogData : "Cannot getAllBlog Data",
  });
});
//Like
//Dislike

/**
 * 
Khi người dùng like một bài blog thì:
1.Check người dùng trước đó có dislike hay không => bỏ dislike
2.Check xem  người đó trước đó có like hay không => bỏ dislike/ thêm like
*/

export const likeBlog = asyncHandler(async (req, res) => {
  console.log("req.user:", req.user);
  const { _id } = req.user;
  const { lid } = req.params;
  if (!lid) throw new Error("Missing Input");
  const blog = await Blog.findById(lid);
  const alreadyDisliked = blog?.dislikes?.find((el) => el.toString() === _id);
  if (alreadyDisliked) {
    const response = await Blog.findByIdAndUpdate(
      lid,
      {
        $pull: { dislikes: _id },
      },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      rs: response,
    });
  }

  const isLiked = blog?.likes?.find((el) => el.toString() === _id);
  if (isLiked) {
    const response = await Blog.findByIdAndUpdate(
      lid,
      {
        $pull: { likes: _id },
      },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      rs: response,
    });
  } else {
    const response = await Blog.findByIdAndUpdate(
      lid,
      {
        $push: { likes: _id },
      },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      rs: response,
    });
  }
});

export const disLikeBlog = asyncHandler(async (req, res) => {
  console.log("req.user:", req.user);
  const { _id } = req.user;
  const { lid } = req.params;
  if (!lid) throw new Error("Missing Input");
  const blog = await Blog.findById(lid);
  const alreadyLiked = blog?.likes?.find((el) => el.toString() === _id);
  if (alreadyLiked) {
    const response = await Blog.findByIdAndUpdate(
      lid,
      {
        $pull: { likes: _id },
      },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      rs: response,
    });
  }

  const isDisLiked = blog?.dislikes?.find((el) => el.toString() === _id);
  if (isDisLiked) {
    const response = await Blog.findByIdAndUpdate(
      lid,
      {
        $pull: { dislikes: _id },
      },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      rs: response,
    });
  } else {
    const response = await Blog.findByIdAndUpdate(
      lid,
      {
        $push: { dislikes: _id },
      },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      rs: response,
    });
  }
});

const excludeFields =
  "-refreshToken -password -role -createdAt -updatedAt -cart -address -wishlist -isBlocked -__v -passwordChangedAt -_id -mobile -email";
export const getBlog = asyncHandler(async (req, res) => {
  const { lid } = req.params;
  const blog = await Blog.findByIdAndUpdate(
    lid,
    { $inc: { numberViews: 1 } },
    { new: true }
  )

    .populate("likes", excludeFields)
    .populate("dislikes", excludeFields);
  return res.status(200).json({
    success: blog ? true : false,
    getBlogData: blog,
  });
});

export const deleteBlog = asyncHandler(async (req, res) => {
  const { lid } = req.params;
  const deleteBlogData = await Blog.findByIdAndDelete(lid);
  return res.status(200).json({
    success: deleteBlogData ? true : false,
    mes: deleteBlogData
      ? `Xóa thành công ${deleteBlogData.title}`
      : "Xóa không thành công",
  });
});

export const updateImageBlog = asyncHandler(async (req, res) => {
  const { lid } = req.params;
  const response = await Blog.findByIdAndUpdate(
    lid,
    { image: req.file.path },
    { new: true }
  );

  return res.status(200).json({
    success: response ? true : false,
    updateImageBlogData: response ? response : "Cannot update image",
  });
});
