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
    const category = req.query.category;
    
    const query = {};
    
    if (category) {
      query.category = { $regex: new RegExp(category, 'i') };
    }
    
    const products = await Product.find(query)
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();
    
    const count = await Product.countDocuments(query);
    
    res.json({
      products,
      count,
      currentPage: page,
      totalPages: Math.ceil(count / perPage),
      category: category || 'all'
    });
  } catch (error) {
    next(error);
  }
});

router.get("/products/:product", async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.product);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.json(product);
  } catch (error) {
    next(error);
  }
});

router.get("/products/:product/reviews", async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.product);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    const perPage = 4;
    const page = parseInt(req.query.page) || 1;
    
    const reviews = product.reviews;
    
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedReviews = reviews.slice(startIndex, endIndex);
    
    res.json({
      reviews: paginatedReviews,
      count: reviews.length,
      currentPage: page,
      totalPages: Math.ceil(reviews.length / perPage)
    });
  } catch (error) {
    next(error);
  }
});

router.post("/products", async (req, res, next) => {
  try {
    const { category, name, price, image } = req.body;
    
    if (!name || !price) {
      return res.status(400).json({ message: "Name and price are required" });
    }
    
    const product = new Product({
      category,
      name,
      price,
      image: image || "https://via.placeholder.com/250?text=Product+Image"
    });
    
    await product.save();
    
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
});

router.post("/products/:product/reviews", async (req, res, next) => {
  try {
    const { userName, text } = req.body;
    
    if (!userName || !text) {
      return res.status(400).json({ message: "Username and text are required" });
    }
    
    const product = await Product.findById(req.params.product);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    product.reviews.push({ userName, text });
    await product.save();
    
    const newReview = product.reviews[product.reviews.length - 1];
    
    res.status(201).json(newReview);
  } catch (error) {
    next(error);
  }
});

router.delete("/products/:product", async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.product);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
});

router.delete("/reviews/:review", async (req, res, next) => {
  try {
    const product = await Product.findOne({ "reviews._id": req.params.review });
    
    if (!product) {
      return res.status(404).json({ message: "Review not found" });
    }
    
    product.reviews = product.reviews.filter(review => 
      review._id.toString() !== req.params.review
    );
    
    await product.save();
    
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    next(error);
  }
});

export default router;