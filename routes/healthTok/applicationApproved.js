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

const generateApprovalEmailTemplate = (doctorName) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Application Approved - HealthTok</title>
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
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background-color: #4CAF50;
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
          <p>Congratulations! We’re excited to inform you that your application to join the <strong>HealthTok</strong> platform has been <strong>approved</strong>.</p>
          <p>Your credentials have been successfully verified, and you are now officially part of the HealthTok network of certified medical professionals.</p>
          <p>You can now log in to your account and start connecting with patients, managing appointments, and offering your professional expertise.</p>
          <p>If you have any questions or need assistance getting started, don’t hesitate to reach out.</p>
          <p>We’re happy to have you onboard, and we look forward to the impact you'll make on the platform.</p>
          <p>Warm regards,<br/>The HealthTok Team</p>
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

router.post("/applicationApproval", async (req, res) => {
  const { email, doctorName } = req.body;

  try {
    await transporter.sendMail({
      to: email,
      subject: "Welcome to HealthTok - Application Approved",
      html: generateApprovalEmailTemplate(doctorName),
    });

    console.log("Approval email sent");

    return res.status(200).json({
      message: "Approval email sent successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Email sending failed",
    });
  }
});

module.exports = router;
