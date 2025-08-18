const { default: axios } = require("axios");
const router = require("express").Router();
const getZoomAccessToken = require("../../../lib/getZoomAccessToken");

// Create independent voice-only meeting
router.post("/create-instant-voice-meeting", async (req, res) => {
  try {
    const token = await getZoomAccessToken();
    const { topic } = req.body;

    const meetingData = {
      topic: topic || "Voice Call",
      type: 2, // ✅ Scheduled meeting (supports join_before_host)
      start_time: new Date().toISOString(), // start immediately
      settings: {
        host_video: false, // ✅ Video disabled
        participant_video: false, // ✅ Video disabled
        join_before_host: true, // ✅ participants can join without host
        mute_upon_entry: false,
        waiting_room: false, // ✅ No waiting room
        audio: "voip", // ✅ Restrict to internet audio (no phone dial-in)
        auto_recording: "none",

        // Security & convenience
        enforce_login: false,
        enforce_login_domains: "",
        meeting_authentication: false,
        approval_type: 2,
        use_pmi: false,

        // Optional voice optimizations
        alternative_hosts: "",
        jbh_time: 0, // Unlimited join before host time
        allow_multiple_devices: true,
        private_chat: false, // reduce distractions
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
      error: "Failed to create voice meeting",
      details: error.response?.data || error.message,
    });
  }
});

module.exports = router;
