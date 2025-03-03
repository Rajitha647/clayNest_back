import mongoose from 'mongoose';
import usermodel from './usermodel.js'; // Ensure this file uses ES Module export

const productSchema = new mongoose.Schema(
  {
    userid: { type: mongoose.Schema.Types.ObjectId, ref: "user_tbls" }, // Reference the collection name, not the model itself
    title: { type: String },
    price: { type: String },
    description: { type: String },
    category: { type: String },
    stock: { type: String },
    rating: { type: Number },
    image: { type: String }
  },
  { timestamps: true }
);

const productmodel = mongoose.model('product_tbl', productSchema);

export default productmodel; // ✅ Correct ES module export
