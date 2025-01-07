const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const products = require("./router/routes");
const user = require("./router/userrouter");
const cart = require("./router/cartrouter");
const order = require("./router/orderrouter");
const payment=require('./router/payrouter')

const Razorpay = require('razorpay');
const app = express();
require('dotenv').config();

const MONGO_URI = "mongodb://127.0.0.1:27017/claynest_db";

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected successfully."))
  .catch((error) => console.error("MongoDB connection error:", error.message));

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.use("/products", products);
app.use("/user", user);
app.use("/cart", cart);
app.use("/order", order);
app.use('/payment',payment)

const PORT = 9000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
