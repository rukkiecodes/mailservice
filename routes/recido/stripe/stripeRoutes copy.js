const express = require("express");
const router = express.Router();
const Stripe = require("stripe");

const stripe = Stripe(process.env.recido_secret_key);

router.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment", // or "subscription"
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Premium Access",
              description: "Access to premium features of the app",
            },
            unit_amount: 199
          },
          quantity: 1,
        },
      ],
      // success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      // cancel_url: `${process.env.CLIENT_URL}/cancel`,
      success_url: `https://rukkiecodes.netlify.app/`,
      cancel_url: `https://rukkiecodes.netlify.app/`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ error: "Unable to create session" });
  }
});

module.exports = router;
