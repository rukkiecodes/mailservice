const router = require("express").Router();
const axios = require("axios");

router.post("/paypal", async (req, res) => {
  try {
    const { data: tokenData } = await axios({
      url: "https://api-m.sandbox.paypal.com/v1/oauth2/token",
      method: "post",
      auth: {
        username: process.env.luxi_live_paypal_clientId,
        password: process.env.luxi_live_paypal_clientSecrete,
      },
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      data: "grant_type=client_credentials",
    });

    const accessToken = tokenData.access_token;

    const order = await axios.post(
      "https://api-m.sandbox.paypal.com/v2/checkout/orders",
      {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: "10.00",
            },
          },
        ],
        application_context: {
          brand_name: "Luxi",
          landing_page: "BILLING", // <--- Shows card form directly
          user_action: "PAY_NOW",
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
    )?.href;
    res.json({ approvalUrl });
  } catch (error) {
    console.error("PayPal error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to create PayPal order" });
  }
});

module.exports = router;
