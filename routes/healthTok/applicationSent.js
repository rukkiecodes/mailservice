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

const generateSubmissionEmailTemplate = (doctorName) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Application Received - HealthTok</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f9f9f9;
          margin: 0;
          padding: 0;
        }
        .email-container {
          max-width: 600px;
          margin: 30px auto;
          background-color: #fff;
          padding: 25px;
          border-radius: 10px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }
        .header {
          background-color: #1976D2;
          color: white;
          padding: 20px;
          border-radius: 10px 10px 0 0;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 22px;
        }
        .content {
          padding: 20px;
          color: #333;
          font-size: 15px;
        }
        .footer {
          text-align: center;
          padding: 20px;
          font-size: 12px;
          color: #888;
        }
        .footer a {
          color: #1976D2;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>HealthTok</h1>
        </div>
        <div class="content">
          <p>Dear ${doctorName || "Doctor"},</p>
          <p>Thank you for submitting your application to join the HealthTok platform.</p>
          <p>We have received your details and documents, and your application is currently <strong>under review</strong> by our verification team.</p>
          <p>This process typically takes 24–72 hours. We may reach out to you for additional information or documentation if needed.</p>
          <p>You will be notified via email once a decision has been made.</p>
          <p>We appreciate your interest in contributing to a trusted healthcare community.</p>
          <p>Sincerely,<br/>The HealthTok Team</p>
        </div>
        <div class="footer">
          <p>Need help? Contact us at <a href="mailto:support@healthTok.com">support@healthTok.com</a></p>
          <p>&copy; ${new Date().getFullYear()} HealthTok. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

router.post("/applicationSubmitted", async (req, res) => {
  const { email, doctorName } = req.body;

  try {
    await transporter.sendMail({
      to: email,
      subject: "Your HealthTok Application Has Been Received",
      html: generateSubmissionEmailTemplate(doctorName),
    });

    return res.status(200).json({
      message: "Submission confirmation email sent",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to send confirmation email",
    });
  }
});

module.exports = router;
