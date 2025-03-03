import Order from '../model/ordermodel.js';
import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_hr0BF8OlzjjEB4',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'DKsMx1hfbeAz0AcoI3wrshY5',
});

// Place a New Order
export const placeOrder = async (req, res) => {
    try {
        const { userId, cartItems, address, totalAmount, paymentMethod } = req.body;

        if (!userId || !cartItems || !address || !totalAmount || !paymentMethod) {
            return res.status(400).json({ message: 'All fields are required' });
        }

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
            const razorpayOrder = await razorpay.orders.create({
                amount: totalAmount * 100,
                currency: 'INR',
                receipt: `order_rcptid_${savedOrder._id}`,
            });

            savedOrder.razorpayDetails = { orderId: razorpayOrder.id };
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
export const handlePaymentSuccess = async (req, res) => {
    try {
        const { orderId, paymentId } = req.body;

        if (!orderId || !paymentId) {
            return res.status(400).json({ message: 'Order ID and Payment ID are required' });
        }

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
export const placeCODOrder = async (req, res) => {
    try {
        const { userId, items, paymentMethod, address, totalAmount } = req.body;
        console.log(req.body);

        if (!userId || !items || !address || !paymentMethod || !totalAmount) {
            return res.status(400).json({ message: 'All fields are required' });
        }

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

        res.json({ status: '1', message: 'COD order placed successfully', orderId: savedOrder._id });
    } catch (error) {
        console.error('Error placing COD order:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Fetch User Orders
export const getUserOrders = async (req, res) => {
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
