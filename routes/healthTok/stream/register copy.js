// routes/stream.js
const router = require("express").Router();
const { StreamChat } = require("stream-chat");

const { HEALTH_TOK_STREAM_KEY, HEALTH_TOK_STREAM_SECRETE } = process.env;

const client = StreamChat.getInstance(
  HEALTH_TOK_STREAM_KEY,
  HEALTH_TOK_STREAM_SECRETE
);

// Register or update user
router.post("/registerStream", async (req, res) => {
  const { email, id } = req.body;

  try {
    await client.upsertUser({
      id,
      email,
      name: email,
    });

    const token = client.createToken(id);

    return res.status(200).json({
      message: "Authentication successful",
      token,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Auth failed",
      error: error.message,
    });
  }
});

// Register push device
router.post("/registerDevice", async (req, res) => {
  const { userId, pushToken } = req.body;

  try {
    await client.addDevice(pushToken, "firebase", userId); // For Expo or Android
    res.status(200).json({ message: "Device registered for push" });
  } catch (error) {
    res.status(500).json({
      message: "Push registration failed",
      error: error.message,
    });
  }
});

module.exports = router;
