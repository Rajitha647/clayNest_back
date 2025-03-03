import mongoose from "mongoose";

// Define the Order schema
const OrderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User', // Reference to the User model
        },
        cartItems: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'Product', // Reference to the Product model
                },
                name: { type: String, required: true }, // Product name
                quantity: { type: Number, required: true }, // Quantity of the product
                price: { type: Number, required: true }, // Price of the product
            },
        ],
        address: {
            type: String,
            required: true, // Shipping address
        },
        totalAmount: {
            type: Number,
            required: true, // Total order amount
        },
        paymentMethod: {
            type: String,
            enum: ['razorpay', 'cod'], // Payment method (Razorpay or Cash on Delivery)
            required: true,
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'failed'], // Payment status
            default: 'pending',
        },
        razorpayDetails: {
            orderId: { type: String }, // Razorpay Order ID
            paymentId: { type: String }, // Razorpay Payment ID
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'], // Order status
            default: 'pending',
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt fields
    }
);

// Export the model
const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;
