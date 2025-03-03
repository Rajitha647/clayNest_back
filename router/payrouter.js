import express from "express";
import { createOrder, verifyPayment } from "../control/payCtrl.js"; // Ensure the file extension is included for ES Modules

const router = express.Router();

router.post("/createorder", createOrder);
router.post("/verify", verifyPayment);

export default router;
