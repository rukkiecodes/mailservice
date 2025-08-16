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

// Create instant meeting
router.post("/create-meeting", async (req, res) => {
  try {
    const token = await getZoomAccessToken();
    const { topic } = req.body; // Only topic needed for instant meetings

    const meetingData = {
      topic: topic || "Instant Meeting", // Default topic if none provided
      type: 1, // Instant meeting (changed from 2)
      settings: {
        host_video: true,
        participant_video: true,
        join_before_host: true, // Allow participants to join before host
        mute_upon_entry: false, // Don't mute for instant calls
        waiting_room: false,
        audio: "both",
        auto_recording: "none", // No recording for instant meetings
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
      error: "Failed to create instant meeting",
      details: error.response?.data || error.message,
    });
  }
});

module.exports = router;
