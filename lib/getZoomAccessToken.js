const { default: axios } = require("axios");

const getZoomAccessToken = async () => {
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
};

module.exports = getZoomAccessToken;
