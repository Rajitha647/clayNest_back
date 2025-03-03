import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url"; // Needed to fix __dirname in ES modules

import products from "./router/routes.js";
import user from "./router/userrouter.js";
import cart from "./router/cartrouter.js";
import order from "./router/orderrouter.js";
import payment from "./router/payrouter.js";
import Razorpay from "razorpay";

const app = express();

// Fix __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MongoDB Atlas URI (Use your actual credentials)
const MONGO_URI = "mongodb+srv://rajitha:rajitha123@cluster0.gdvdb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB Atlas
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas connected successfully."))
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  });

// Middleware
app.use(cors({ origin: ["https://clay-nest.onrender.com"] })); // Replace with your frontend URL
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/products", products);
app.use("/user", user);
app.use("/cart", cart);
app.use("/order", order);
app.use("/payment", payment);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// Start the Server
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
