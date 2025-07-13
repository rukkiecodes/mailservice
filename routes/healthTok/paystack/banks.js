const express = require("express");
const https = require("https");
const router = express.Router();

const PAYSTACK_SECRET_KEY = process.env.healthtok_Test_Secrete_key
// const PAYSTACK_SECRET_KEY = process.env.healthtok_Live_Secrete_key

router.get("/banks", (req, res) => {
  const options = {
    hostname: "api.paystack.co",
    port: 443,
    path: "/bank?currency=NGN",
    method: "GET",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
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
        res.status(200).json({
          success: true,
          banks: result.data,
        });
      } catch (e) {
        res
          .status(500)
          .json({
            success: false,
            error: "Invalid JSON response from Paystack",
          });
      }
    });
  });

  request.on("error", (error) => {
    console.error("Paystack error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch banks" });
  });

  request.end();
});

module.exports = router;
