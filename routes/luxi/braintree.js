const router = require("express").Router();
const axios = require("axios");
const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.luxi_merchantId,
  publicKey: process.env.luxi_publicKey,
  privateKey: process.env.luxi_privateKey,
});

router.post("/braintree", async (req, res) => {
  const { amount } = req.body;

  gateway.transaction.sale(
    {
      amount: amount,
      paymentMethodNonce: "nonce-from-the-client",
      options: {
        submitForSettlement: true,
      },
    },
    function (error, result) {
      if (error) {
        console.log(error);
        return;
      }

      if (result.success) {
        // console.log("Transaction ID: " + result.transaction.id);
        res.json({
          status: "success",
          transaction: result,
        });
      } else {
        console.error(result.message);
      }
    }
  );
});

module.exports = router;
