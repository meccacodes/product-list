import express from "express";
// import faker from "faker";
import Product from "../models/product.js";

const router = express.Router();

// router.get("/generate-fake-data", async (req, res, next) => {
//   try {
//     for (let i = 0; i < 90; i++) {
//       let product = new Product();

//       product.category = faker.commerce.department();
//       product.name = faker.commerce.productName();
//       product.price = faker.commerce.price();
//       product.image = "https://via.placeholder.com/250?text=Product+Image";

//       await product.save();
//     }
//     res.status(200).json({ message: "Fake data generated successfully" });
//   } catch (error) {
//     next(error);
//   }
// });

router.get("/products", async (req, res, next) => {
  try {
    const perPage = 9;
    const page = req.query.page || 1;

    const products = await Product.find({})
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();
    
    const count = await Product.countDocuments();
    
    res.json({
      products,
      count,
      currentPage: page,
      totalPages: Math.ceil(count / perPage)
    });
  } catch (error) {
    next(error);
  }
});

export default router;