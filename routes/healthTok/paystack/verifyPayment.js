const express = require("express");
const router = express.Router();
const axios = require("axios");

const PAYSTACK_SECRET_KEY = process.env.healthtok_Test_Secrete_key
// const PAYSTACK_SECRET_KEY = process.env.healthtok_Live_Secrete_key

// POST /verifyPayment
router.post("/verifyPayment", async (req, res) => {
  const { reference } = req.body;

  if (!reference) {
    return res.status(400).json({
      success: false,
      message: "Missing required field: reference",
    });
  }

  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data.data;

    if (data.status !== "success") {
      return res.status(400).json({
        success: false,
        message: "Transaction not successful",
        data,
      });
    }

    // Save this transaction in your DB
    // Example fields to store:
    // - reference, amount, email, doctorId, patientId, appointmentId, paid_at

    return res.status(200).json({
      success: true,
      message: "Payment verified",
      data,
    });
  } catch (error) {
    console.error("Verification error:", error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to verify transaction",
      error: error.response?.data || error.message,
    });
  }
});

module.exports = router;
