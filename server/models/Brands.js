import mongoose from "mongoose";

// Declare the Schema of the Mongo model
var brandSchema = new mongoose.Schema(
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
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductCategory",
      required: true,
    },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

//Export the model
const Brand = mongoose.model("Brand", brandSchema);

export default Brand;
