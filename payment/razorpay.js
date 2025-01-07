const Razorpay = require('razorpay');

const razorpayInstance = new Razorpay({
  key_id: '123', // Replace with your Razorpay Key ID
  key_secret: 'R123', // Replace with your Razorpay Key Secret
});

module.exports = { razorpayInstance };