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
  },
  { timestamps: true }
);

//Export the model
const ProductCategory = mongoose.model(
  "ProductCategory",
  ProductCategorySchema
);

export default ProductCategory;
