import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    ram_name: {
      type: String,
      required: true,
    },
    price: { type: Number, required: true },
    quantity: {
      type: Number,
      default: 0,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    ratings: [
      {
        star: { type: Number },
        postedBy: { type: mongoose.ObjectId, ref: "User" },
        comment: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const Variant = mongoose.model("Variant", variantSchema);
export default Variant;
