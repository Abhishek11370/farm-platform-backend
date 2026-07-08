import Razorpay from "razorpay";
import crypto from "crypto";
import { logger } from "./logger";

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

const isConfigured = !!(keyId && keySecret);

let razorpay: Razorpay | null = null;

if (isConfigured) {
  razorpay = new Razorpay({
    key_id: keyId!,
    key_secret: keySecret!,
  });
  logger.info("Razorpay initialized successfully.");
} else {
  logger.warn(
    "Razorpay credentials missing. Payment integrations will run in simulated demo mode.",
  );
}

export const createRazorpayOrder = async (
  amount: number,
  receiptId: string,
) => {
  const amountInPaise = Math.round(amount * 100);
  if (!isConfigured || !razorpay) {
    logger.debug("Simulating Razorpay order creation.");
    return {
      id: `order_sim_${crypto.randomBytes(8).toString("hex")}`,
      amount: amountInPaise,
      currency: "INR",
      receipt: receiptId,
      status: "created",
      notes: { simulated: true },
    };
  }

  try {
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: receiptId,
      notes: { receiptId },
    });
    return order;
  } catch (error) {
    logger.error("Error creating Razorpay order:", error);
    throw new Error("Payment order creation failed");
  }
};

export const verifyPaymentSignature = (
  razorpayOrderId: string,
  razorpayPaymentId: string,
  signature: string,
): boolean => {
  if (!isConfigured) {
    logger.debug("Skipping signature verification in simulated mode.");
    return true; // Always authorize in simulated mode
  }
  try {
    const webhookSecret =
      process.env.RAZORPAY_WEBHOOK_SECRET || keySecret || "";
    const shasum = crypto.createHmac("sha256", webhookSecret);
    shasum.update(`${razorpayOrderId}|${razorpayPaymentId}`);
    const digest = shasum.digest("hex");
    return digest === signature;
  } catch (error) {
    logger.error("Signature verification failed:", error);
    return false;
  }
};
