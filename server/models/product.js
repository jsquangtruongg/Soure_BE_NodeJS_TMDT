import mongoose from "mongoose";

var productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "ProductCategory",
    },
    quantity: {
      type: Number,
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },
    image: {
      type: Array,
    },
    colors: [
      {
        color: {
          type: String,
          enum: [
            "Black",
            "Red",
            "Grown",
            "Blue",
            "Green",
            "Yellow",
            "White",
            "Purple",
            "Orange",
            "Gray",
            "Grey",
            "Pink",
          ],
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
      },
    ],
    variants: [
      {
        variant_name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        image: { type: String },
      },
    ],
    ratings: [
      {
        star: { type: Number },
        postedBy: { type: mongoose.ObjectId, ref: "User" },
        comment: { type: String },
      },
    ],
    totalRatings: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
const Product = mongoose.model("Product", productSchema);

export default Product;
