const CLIENT_ID = process.env.recido_paypal_test_client_id;
const CLIENT_SECRET = process.env.recido_paypal_test_secret_key;

export async function generateAccessToken () {
  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

  const response = await axios.post(
    `${BASE_URL}/v1/oauth2/token`,
    new URLSearchParams({ grant_type: "client_credentials" }),
    {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data.access_token;
}