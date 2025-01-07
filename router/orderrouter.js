const express = require('express');
const router = express.Router();
const {
    placeOrder,
    handlePaymentSuccess,
    placeCODOrder,
    getUserOrders,
} = require('../control/orderCtrl');

// Place a new order (Razorpay or COD)
router.post('/placeorder', placeOrder);

// Handle Razorpay payment success
router.post('/paymentsuccess', handlePaymentSuccess);

// Place a COD order
router.post('/cod', placeCODOrder);

// Get orders for a specific user
router.get('/getorders/:userId', getUserOrders);

module.exports = router;
