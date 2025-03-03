import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: { type: String },
    phone: { type: String },
    email: { type: String },
    password: { type: String }
  },
  { timestamps: true }
);

const usermodel = mongoose.model("user_tbls", userSchema);

export default usermodel; // ✅ Correct ES module export
