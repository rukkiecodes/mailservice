const express = require("express");
const https = require("https");
const router = express.Router();

// const PAYSTACK_SECRET_KEY = process.env.healthtok_Test_Secrete_key
const PAYSTACK_SECRET_KEY = process.env.healthtok_Live_Secrete_key

router.post("/create-recipient", (req, res) => {
  const { name, account_number, bank_code } = req.body;

  const params = JSON.stringify({
    type: "nuban",
    name: name, // Doctor's name
    account_number: account_number,
    bank_code: bank_code, // e.g. Access Bank: "044"
    currency: "NGN",
  });

  const options = {
    hostname: "api.paystack.co",
    port: 443,
    path: "/transferrecipient",
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
          return res.status(201).json({
            success: true,
            message: "Recipient created successfully",
            data: result.data, // includes recipient_code
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
    console.error("Recipient creation error:", error);
    res
      .status(500)
      .json({ success: false, error: "Request to Paystack failed" });
  });

  request.write(params);
  request.end();
});

module.exports = router;
