const express = require("express");
const Cart = require("../model/cartmodel");
const router = express.Router();

// Add to Cart
router.post("/", async (req, res) => {
  const { userId, productId, productName, quantity, price, image } = req.body;

  if (!userId || !productId || !productName || !quantity || !price || !image) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingItem = await Cart.findOne({ userId, productId });

    if (existingItem) {
      existingItem.quantity += quantity;
      await existingItem.save();
    } else {
      const newItem = new Cart({ userId, productId, productName, quantity, price, image });
      await newItem.save();
    }

    const updatedCart = await Cart.find({ userId });
    res.json({ message: "Added to cart", cart: updatedCart });
  } catch (error) {
    res.status(500).json({ message: "Error adding to cart", error });
  }
});

// Fetch Cart Items
router.get("/:userId", async (req, res) => {
  try {
    const cartItems = await Cart.find({ userId: req.params.userId });
    res.json({ cart: cartItems });
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart items", error });
  }
});

// Remove Item from Cart
router.delete("/:userId/:productId", async (req, res) => {
  try {
    await Cart.deleteOne({ userId: req.params.userId, productId: req.params.productId });
    const updatedCart = await Cart.find({ userId: req.params.userId });
    res.json({ message: "Item removed from cart", cart: updatedCart });
  } catch (error) {
    res.status(500).json({ message: "Error removing item", error });
  }
});

// Update Item Quantity
router.patch("/:userId", async (req, res) => {
  const { productId, quantity } = req.body;

  if (quantity <= 0) {
    return res.status(400).json({ message: "Quantity must be greater than 0" });
  }

  try {
    const cartItem = await Cart.findOne({ userId: req.params.userId, productId });

    if (cartItem) {
      cartItem.quantity = quantity;
      await cartItem.save();
      const updatedCart = await Cart.find({ userId: req.params.userId });
      res.json({ message: "Quantity updated", cart: updatedCart });
    } else {
      res.status(404).json({ message: "Item not found in cart" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating quantity", error });
  }
});

module.exports = router;