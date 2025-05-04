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

router.post("/notifyAdminPendingPayment", async (req, res) => {
  const { adminEmail, userFullName, email, reference, amount, paymentMethod } =
    req.body;

  try {
    await transporter.sendMail({
      to: adminEmail,
      subject: "💰 Payment Awaiting Confirmation - Luxy",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Payment Pending Confirmation</title>
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
              background-color: #ff9800;
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
            .email-footer {
              text-align: center;
              font-size: 12px;
              color: #777777;
              padding: 10px;
            }
            .details-box {
              background-color: #f0f0f0;
              padding: 12px;
              border-radius: 6px;
              font-family: monospace;
              text-align: left;
              font-size: 16px;
              line-height: 1.6;
              margin-top: 15px;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="email-header">
              <h1>Pending Payment Confirmation</h1>
            </div>
            <div class="email-body">
              <p>Hello Admin,</p>
              <p><strong>${userFullName}</strong> (<em>${email}</em>) has made a payment and is waiting for confirmation.</p>
              <div class="details-box">
                Amount: ${amount}<br />
                Reference: ${reference}<br />
                Method: ${paymentMethod}<br />
                Status: Awaiting Confirmation
              </div>
              <p>Please review and confirm the transaction as soon as possible.</p>
            </div>
            <div class="email-footer">
              &copy; ${new Date().getFullYear()} Luxy Admin Panel
            </div>
          </div>
        </body>
        </html>
      `,
    });

    res.status(200).json({ message: "Admin notified of pending payment" });
  } catch (error) {
    console.error("Error sending admin payment alert:", error);
    res.status(500).json({
      message: "Failed to notify admin",
      error: error.message,
    });
  }
});

module.exports = router;
