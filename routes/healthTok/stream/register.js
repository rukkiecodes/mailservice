const router = require("express").Router();
const { StreamChat } = require("stream-chat");

const { HEALTH_TOK_STREAM_KEY, HEALTH_TOK_STREAM_SECRETE } = process.env;

const client = StreamChat.getInstance(
  HEALTH_TOK_STREAM_KEY,
  HEALTH_TOK_STREAM_SECRETE
);

router.post("/registerStream", async (req, res) => {
  const { email, id } = req.body;

  try {
    await client.upsertUser({
      id: id,
      email,
      name: email,
    });

    const token = client.createToken(id);

    return res.status(200).json({
      message: "Authentication was successful",
      token,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Auth failed",
      error: error.message || "Unknown error",
    });
  }
});

module.exports = router;
