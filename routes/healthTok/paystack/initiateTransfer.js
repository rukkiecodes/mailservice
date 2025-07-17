const express = require("express");
const https = require("https");
const router = express.Router();

// const PAYSTACK_SECRET_KEY = process.env.healthtok_Test_Secrete_key
const PAYSTACK_SECRET_KEY = process.env.healthtok_Live_Secrete_key

router.post("/initiate-transfer", (req, res) => {
  const { amount, recipient_code, reason } = req.body;

  const params = JSON.stringify({
    source: "balance",
    amount: Math.floor(amount), // in kobo
    recipient: recipient_code,
    reason: reason || "Consultation Payout",
  });

  const options = {
    hostname: "api.paystack.co",
    port: 443,
    path: "/transfer",
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
  };

  const request = https.request(options, (paystackRes) => {
    let data = "";

    paystackRes.on("data", (chunk) => {
      data += chunk;
    });

    paystackRes.on("end", () => {
      try {
        const result = JSON.parse(data);
        if (result.status) {
          return res.status(200).json({
            success: true,
            message: "Transfer initiated",
            data: result.data,
          });
        } else {
          return res
            .status(400)
            .json({ success: false, message: result.message });
        }
      } catch (e) {
        return res
          .status(500)
          .json({ success: false, error: "Invalid JSON from Paystack" });
      }
    });
  });

  request.on("error", (error) => {
    console.error("Transfer error:", error);
    res
      .status(500)
      .json({ success: false, error: "Request to Paystack failed" });
  });

  request.write(params);
  request.end();
});

module.exports = router;