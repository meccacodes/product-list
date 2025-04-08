import mongoose from "mongoose";
const { Schema } = mongoose;

const ProductSchema = new Schema({
    category: String,
    name: String,
    price: Number,
    image: String,
});

const Product = mongoose.model("Product", ProductSchema);
export default Product;