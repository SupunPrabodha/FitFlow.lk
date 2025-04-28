import express from "express";
import { createPaymentIntent, confirmPayment } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create-payment-intent", createPaymentIntent);
router.post("/confirm-payment", confirmPayment);

export default router;