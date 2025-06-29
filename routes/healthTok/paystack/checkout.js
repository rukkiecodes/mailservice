const express = require("express");
const https = require("https");
const router = express.Router();
const axios = require("axios");

// Replace this with your actual secret key
const PAYSTACK_SECRET_KEY = "sk_test_15c4d5316c4b298d0b032b3707aec7a6827f6c33";

router.post("/checkout", async (req, res) => {
  const { email, amount } = req.body;

  try {
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount,
        callback_url: "https://hello.pstk.xyz/callback",
        metadata: {
          cancel_action: "https://your-cancel-url.com",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      checkoutUrl: response.data.data.authorization_url,
      reference: response.data.data.reference,
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({
      message: "Paystack initialization failed",
    });
  }
});

module.exports = router;
