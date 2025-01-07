// const Order = require("../model/ordermodel");
// const User = require("../model/usermodel");
// const Product = require("../model/productmodel");

// const placeOrder = async (req, res) => {
//   const { billingDetails, products, totalAmount, paymentMethod, orderNotes } = req.body;
//   const userId = req.userId; // Use the userId from the token

//   if (!billingDetails || !products || !totalAmount || !paymentMethod) {
//     return res.status(400).json({ message: "Incomplete order details" });
//   }

//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const validProducts = [];
//     for (let product of products) {
//       const { productId, quantity } = product;
//       const productDoc = await Product.findById(productId);
//       if (!productDoc || productDoc.stock < quantity) {
//         return res.status(400).json({
//           message: `Insufficient stock for product ${productId}`,
//         });
//       }
//       validProducts.push({
//         productId,
//         quantity,
//         price: productDoc.price,
//         image: productDoc.image,
//       });
//     }

//     const newOrder = new Order({
//       userId,
//       billingDetails,
//       products: validProducts,
//       totalAmount,
//       paymentMethod,
//       orderNotes,
//     });

//     const order = await newOrder.save();
//     res.status(201).json(order);
//   } catch (error) {
//     console.error("Error placing order:", error);
//     res.status(500).json({ message: "Error placing order", error });
//   }
// };

// const getOrders = async (req, res) => {
//   try {
//     const orders = await Order.find({ userId: req.userId }).populate(
//       "products.productId",
//       "name price image"
//     );
//     res.status(200).json({ orders });
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching orders", error });
//   }
// };

// const getOrderById = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const order = await Order.findById(orderId).populate("products.productId", "name price image");
//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }
//     res.status(200).json(order);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching order", error });
//   }
// };

// const updateOrderStatus = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const { status, paymentId } = req.body;
//     const order = await Order.findById(orderId);

//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     order.status = status;

//     if (status === "Paid" && paymentId) {
//       order.paymentId = paymentId;
//     }

//     await order.save();
//     res.status(200).json({ message: "Order status updated successfully", order });
//   } catch (error) {
//     res.status(500).json({ message: "Error updating order status", error });
//   }
// };

// const totalorder = async (req, res) => {
//   try {
//     const totalOrders = await Order.countDocuments();
//     res.status(200).json({ total: totalOrders });
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching total orders", error });
//   }
// };

// module.exports = {
//   placeOrder,
//   getOrders,
//   getOrderById,
//   updateOrderStatus,
//   totalorder,
// };


const Order = require('../model/ordermodel');
const Razorpay = require('razorpay');
require('dotenv').config();

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: 'rzp_test_hr0BF8OlzjjEB4',
    key_secret: 'DKsMx1hfbeAz0AcoI3wrshY5',
});

// Place a New Order
const placeOrder = async (req, res) => {
    try {
        const { userId, cartItems, address, totalAmount, paymentMethod } = req.body;

        // Validate inputs
        if (!userId || !cartItems || !address || !totalAmount || !paymentMethod) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create new order
        const order = new Order({
            userId,
            cartItems,
            address,
            totalAmount,
            paymentMethod,
            paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
            status: paymentMethod === 'cod' ? 'pending' : 'created',
        });

        const savedOrder = await order.save();

        if (paymentMethod === 'razorpay') {
            // Create Razorpay order if payment method is Razorpay
            const razorpayOrder = await razorpay.orders.create({
                amount: totalAmount * 100, // Amount in paise
                currency: 'INR',
                receipt: `order_rcptid_${savedOrder._id}`,
            });

            savedOrder.razorpayDetails.orderId = razorpayOrder.id;
            await savedOrder.save();

            return res.status(201).json({
                message: 'Order created successfully',
                orderId: savedOrder._id,
                razorpayOrderId: razorpayOrder.id,
            });
        }

        res.status(201).json({ message: 'Order placed successfully', orderId: savedOrder._id });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Handle Razorpay Payment Success
const handlePaymentSuccess = async (req, res) => {
    try {
        const { orderId, paymentId } = req.body;

        if (!orderId || !paymentId) {
            return res.status(400).json({ message: 'Order ID and Payment ID are required' });
        }

        // Find and update the order
        const order = await Order.findOne({ 'razorpayDetails.orderId': orderId });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.paymentStatus = 'paid';
        order.razorpayDetails.paymentId = paymentId;
        order.status = 'confirmed';

        await order.save();

        res.status(200).json({ message: 'Payment successful', orderId: order._id });
    } catch (error) {
        console.error('Error handling payment success:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Place COD Order
const placeCODOrder = async (req, res) => {
    try {
        const { userId, items,paymentMethod, address, totalAmount } = req.body;
        console.log(req.body);
        

        // Validate inputs
        if (!userId || !items || !address ||!paymentMethod || !totalAmount) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create COD order
        const order = new Order({
            userId,
            items,
            address,
            totalAmount,
            paymentMethod: 'cod',
            paymentStatus: 'pending',
            status: 'pending',
        });

        const savedOrder = await order.save();
        if (!savedOrder) {
            console.error('Error saving COD order:', order);
        }
        

        res.json({ status:'1',message: 'COD order placed successfully', orderId: savedOrder._id });
    } catch (error) {
        console.error('Error placing COD order:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Fetch User Orders
const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const orders = await Order.find({ userId }).populate('items.productId');

        res.status(200).json({ orders });
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    placeOrder,
    handlePaymentSuccess,
    placeCODOrder,
    getUserOrders,
};
