const { StreamClient } = require("@stream-io/node-sdk");
const router = require("express").Router();

const { HEALTH_TOK_STREAM_KEY, HEALTH_TOK_STREAM_SECRETE } = process.env;

const streamClient = new StreamClient(
  HEALTH_TOK_STREAM_KEY,
  HEALTH_TOK_STREAM_SECRETE
);

router.post("/registerStream", async (req, res) => {
  const { id, email } = req.body;
  try {
    await streamClient.upsertUsers([{ id, name: email, image: email }]);

    const token = streamClient.createToken({
      user_id: id,
      // option: validity_in_seconds: 3600
    });

    res.status(200).json({ message: "Authentication successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Auth failed", error: err.message });
  }
});

module.exports = router;
