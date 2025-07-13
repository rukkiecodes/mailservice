const express = require("express");
const router = express.Router();
const axios = require("axios");

const PAYSTACK_SECRET_KEY = process.env.healthtok_Test_Secrete_key
// const PAYSTACK_SECRET_KEY = process.env.healthtok_Live_Secrete_key

router.post("/initiatePayment", async (req, res) => {
  const { email, amount, patientId, doctorId, appointmentId } = req.body;

  if (!email || !amount || !patientId || !doctorId || !appointmentId) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields.",
    });
  }

  try {
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: amount * 100, // Convert to kobo
        metadata: {
          patientId,
          doctorId,
          appointmentId,
        },
        callback_url: "https://yourapp.com/verify-payment", // Redirect after payment
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Payment initialized",
      authorization_url: response.data.data.authorization_url,
      access_code: response.data.data.access_code,
      reference: response.data.data.reference,
    });
  } catch (error) {
    console.error("Paystack error:", error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to initialize payment",
      error: error.response?.data || error.message,
    });
  }
});

module.exports = router;
