const router = require("express").Router();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../../models/user");
const userOTPVerification = require("../../models/userOTPVerification");
const nodemailer = require("nodemailer");
const axios = require("axios");

const PAYPAL_API = "https://api-m.sandbox.paypal.com";

const getAccessToken = async () => {
  const response = await axios({
    url: `${PAYPAL_API}/v1/oauth2/token`,
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    auth: {
      username:
        "AY2TFqmhsHRESaQKrrE2M-iF3uCPPdKysrPVV3dn3cGJWTCZd6pqQ6wqCdw8t4AoHA14OIi8K0k9w6T9",
      password:
        "EALE95F-hw1iym9QXid2tQMl5p6TWgFm47KSXlFol46wuzdcMp5xfR4gBvhSruSIeXBCdIdUKo-baL79",
    },
    data: "grant_type=client_credentials",
  });

  return response.data.access_token;
};

router.post("/paypal", async (req, res) => {
  try {
    const accessToken = await getAccessToken();

    const order = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders`,
      {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: req.body.amount || "10.00", // Default $10.00
            },
          },
        ],
        application_context: {
          return_url: "https://your-redirect-url.com/success",
          cancel_url: "https://your-redirect-url.com/cancel",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const approvalUrl = order.data.links.find(
      (link) => link.rel === "approve"
    ).href;

    res.json({
      orderID: order.data.id,
      approvalUrl,
    });
  } catch (err) {
    console.error("Order creation failed:", err?.response?.data || err.message);
    res.status(500).json({ error: "Failed to create PayPal order" });
  }
});

module.exports = router;
