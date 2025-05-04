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

router.post("/transactionInProgress", async (req, res) => {
  const { email, reference, amount } = req.body;

  try {
    await transporter.sendMail({
      to: email,
      subject: "⏳ Transaction In Progress - Luxy",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Transaction In Progress</title>
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
              background-color: #7D3FE2;
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
            .transaction-details {
              background-color: #f0f0f0;
              padding: 12px;
              border-radius: 6px;
              font-family: monospace;
              text-align: center;
              font-size: 18px;
              margin: 15px 0;
              line-height: 1.6;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="email-header">
              <h1>Transaction In Progress</h1>
            </div>
            <div class="email-body">
              <p>Dear User,</p>
              <p>We're letting you know that your recent transaction is currently being processed. Please be patient while we complete the transaction.</p>
              <div class="transaction-details">
                Amount: ${Number(amount)}<br />
                Reference: ${reference}<br />
                Status: In Progress
              </div>
              <p>You will receive an email once the transaction is completed successfully.</p>
              <p>Thank you for your patience.<br/>– Luxy Team</p>
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
      .json({ message: "Transaction in progress email sent successfully" });
  } catch (error) {
    console.error("Error sending transaction in progress email:", error);
    res.status(500).json({
      message: "Failed to send transaction in progress email",
      error: error.message,
    });
  }
});

module.exports = router;
