const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const products = require("./router/routes");
const user = require("./router/userrouter");
const cart = require("./router/cartrouter");
const order = require("./router/orderrouter");
const payment = require("./router/payrouter");

const Razorpay = require("razorpay");

const app = express();

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

// Serve React Frontend (After Building)
app.use(express.static(path.join(__dirname, "client", "build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

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
