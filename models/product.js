import mongoose from "mongoose";
const { Schema } = mongoose;

const ReviewSchema = new Schema({
  userName: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const ProductSchema = new Schema({
    category: String,
    name: String,
    price: Number,
    image: String,
    reviews: [ReviewSchema]
});

const Product = mongoose.model("Product", ProductSchema);
export default Product;