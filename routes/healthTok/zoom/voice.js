const { default: axios } = require("axios");

// routes/stream.js
const router = require("express").Router();

async function getZoomAccessToken() {
  const ACCOUNT_ID = process.env.HEALTOK_ZOOM_ACCOUNT_ID;
  const CLIENT_ID = process.env.HEALTOK_ZOOM_CLIENT_ID;
  const CLIENT_SECRET = process.env.HEALTOK_ZOOM_CLIENT_SECRET;

  const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
    "base64"
  );

  const response = await axios.post("https://zoom.us/oauth/token", null, {
    params: {
      grant_type: "account_credentials",
      account_id: ACCOUNT_ID,
    },
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return response.data.access_token;
}

// Register or update user
router.post("/create-instant-voice-meeting", async (req, res) => {
  try {
    const token = await getZoomAccessToken();
    const { topic } = req.body;

    const meetingData = {
      topic,
      type: 1,
      settings: {
        host_video: false,
        participant_video: false,
        audio: "both",
        join_before_host: true,
        mute_upon_entry: false,
        waiting_room: false,
        auto_recording: "none",
      },
    };

    const response = await axios.post(
      "https://api.zoom.us/v2/users/me/meetings",
      meetingData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Zoom API Error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Failed to create meeting",
      details: error.response?.data || error.message,
    });
  }
});

module.exports = router;
