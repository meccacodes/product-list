import express from "express";
import { connect } from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

import mainRoutes from "./routes/main.js";

app.use(mainRoutes);


try {
  await connect("mongodb://localhost:27017/product-list");
  console.log("Connected to MongoDB successfully");
  app.listen(8000, () => {
    console.log("Server is running on port 8000");
  });
} catch (error) {
  console.error("Failed to connect to MongoDB:", error);
  process.exit(1);
}