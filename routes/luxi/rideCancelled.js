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

router.post("/rideCancelled", async (req, res) => {
  const { email, bookingCode } = req.body;

  try {
    await transporter.sendMail({
      to: email,
      subject: "❌ Ride Cancelled - Luxy",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Ride Cancelled</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
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
              background-color: #e53935;
              color: #ffffff;
              text-align: center;
              padding: 20px;
              border-radius: 8px 8px 0 0;
            }
            .email-header h1 {
              margin: 0;
              font-size: 24px;
            }
            .email-body {
              padding: 20px;
              color: #333333;
              font-size: 16px;
            }
            .email-footer {
              text-align: center;
              font-size: 12px;
              color: #777777;
              padding: 10px;
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
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="email-header">
              <h1>Ride Cancelled</h1>
            </div>
            <div class="email-body">
              <p>Hi Driver,</p>
              <p>We wanted to let you know that the following ride has been cancelled by the user:</p>
              <div class="booking-code">${bookingCode}</div>
              <p>No further action is needed. We'll notify you when a new ride is available.</p>
              <p>Thank you for your understanding.<br/>– Luxy Team</p>
            </div>
            <div class="email-footer">
              &copy; ${new Date().getFullYear()} Luxy. All rights reserved.
            </div>
          </div>
        </body>
        </html>
      `,
    });

    res.status(200).json({ message: "Cancellation email sent successfully" });
  } catch (error) {
    console.error("Error sending cancellation email:", error);
    res
      .status(500)
      .json({
        message: "Failed to send cancellation email",
        error: error.message,
      });
  }
});

module.exports = router;