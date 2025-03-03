import express from "express";
import {
    placeOrder,
    handlePaymentSuccess,
    placeCODOrder,
    getUserOrders,
} from "../control/orderCtrl.js"; // Ensure the file extension is .js for ES Modules

const router = express.Router();

// Place a new order (Razorpay or COD)
router.post("/placeorder", placeOrder);

// Handle Razorpay payment success
router.post("/paymentsuccess", handlePaymentSuccess);

// Place a COD order
router.post("/cod", placeCODOrder);

// Get orders for a specific user
router.get("/getorders/:userId", getUserOrders);

export default router;
