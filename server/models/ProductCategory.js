import mongoose from "mongoose";

// Declare the Schema of the Mongo model
var ProductCategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    image: {
      type: Array,
    },
    brands: [{ type: mongoose.Schema.Types.ObjectId, ref: "Brand" }],
  },
  { timestamps: true }
);

//Export the model
const ProductCategory = mongoose.model(
  "ProductCategory",
  ProductCategorySchema
);

export default ProductCategory;
