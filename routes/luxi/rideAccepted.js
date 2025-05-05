const router = require("express").Router();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.luxiEmail,
    pass: process.env.luxiPassword,
  },
});

router.post("/rideAccepted", async (req, res) => {
  const { email, bookingCode } = req.body;

  try {
    await transporter.sendMail({
      to: email,
      subject: "✅ Your Ride Has Been Accepted - Luxy",
      html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Ride Accepted</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f9f9f9;
          margin: 0;
          padding: 0;
        }
        .email-container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .email-header {
          background-color: #2ecc71;
          color: #ffffff;
          text-align: center;
          padding: 20px;
          border-radius: 8px 8px 0 0;
        }
        .email-header h1 {
          margin: 0;
          font-size: 22px;
        }
        .email-body {
          padding: 20px;
          color: #333333;
          font-size: 16px;
        }
        .booking-code {
          background-color: #f0f0f0;
          padding: 12px;
          border-radius: 6px;
          font-family: monospace;
          text-align: center;
          font-size: 18px;
          margin: 15px 0;
        }
        .email-footer {
          text-align: center;
          font-size: 12px;
          color: #777777;
          padding: 10px;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          <h1>Your Ride is On the Way!</h1>
        </div>
        <div class="email-body">
          <p>Hi there,</p>
          <p>Good news! A driver has accepted your ride request.</p>
          <p>Your booking code:</p>
          <div class="booking-code">${bookingCode}</div>
          <p>Please have this code ready when your driver arrives.</p>
          <p>You can track your driver and manage your ride directly in the Luxy app.</p>
          <p>Thank you for choosing Luxy!<br/>– The Luxy Team</p>
        </div>
        <div class="email-footer">
          &copy; ${new Date().getFullYear()} Luxy. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `,
    });

    res
      .status(200)
      .json({ message: "Ride notification email sent successfully" });
  } catch (error) {
    console.error("Error sending ride email:", error);
    res
      .status(500)
      .json({ message: "Failed to send ride email", error: error.message });
  }
});

module.exports = router;
