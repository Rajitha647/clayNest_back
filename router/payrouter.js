const express = require('express');
const { createOrder, verifyPayment } = require('../control/payCtrl');
const router = express.Router();


router.post('/createorder', createOrder);
router.post('/verify', verifyPayment);
module.exports = router;