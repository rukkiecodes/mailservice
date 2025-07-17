const express = require("express");
const router = express.Router();
const Stripe = require("stripe");

const stripe = Stripe(process.env.recido_stripe_secret_key);

router.post("/create-payment-intent", async (req, res) => {
  const { amount, currency = "usd" } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // in cents e.g. $10 = 1000
      currency,
      automatic_payment_methods: { enabled: true },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

module.exports = router;
