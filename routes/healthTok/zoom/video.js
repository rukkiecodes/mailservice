const { default: axios } = require("axios");
const router = require("express").Router();
const getZoomAccessToken = require("../../../lib/getZoomAccessToken");

// Create independent video meeting
router.post("/create-meeting", async (req, res) => {
  try {
    const token = await getZoomAccessToken();
    const { topic } = req.body;

    const meetingData = {
      topic: topic || "Independent Meeting",
      type: 2, // Scheduled meeting (supports join_before_host)
      start_time: new Date().toISOString(), // start immediately
      settings: {
        host_video: true,
        participant_video: true,
        join_before_host: true, // ✅ participants can join before host
        waiting_room: false, // ✅ no waiting room
        meeting_authentication: false, // ✅ no Zoom login required
        approval_type: 2, // ✅ auto-approve
        audio: "both",
        auto_recording: "none",
        enforce_login: false,
        enforce_login_domains: "",
        alternative_hosts: "",
        use_pmi: false,
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
