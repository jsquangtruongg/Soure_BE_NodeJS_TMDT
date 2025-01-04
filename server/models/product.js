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
    price: { type: Number },
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    variants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Variant" }],
    description: {
      type: String,
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
  },
  {
    timestamps: true,
  }
);
const Product = mongoose.model("Product", productSchema);

export default Product;
