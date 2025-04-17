const router = require("express").Router();
const axios = require("axios");
const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.luxi_merchantId,
  publicKey: process.env.luxi_publicKey,
  privateKey: process.env.luxi_privateKey,
});

router.get("/braintree", async (req, res) => {
  const response = await gateway.clientToken.generate({});
  res.send(response.clientToken);
});

module.exports = router;