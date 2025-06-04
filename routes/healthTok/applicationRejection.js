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

const generateRejectionEmailTemplate = (doctorName) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Application Declined - HealthTok</title>
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
          background-color: #d32f2f;
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
          <p>Thank you for applying to join the HealthTok platform.</p>
          <p>After careful review of your submitted information and documents, we regret to inform you that your application has been <strong>declined</strong> at this time.</p>
          <p>Unfortunately, we were unable to verify the credentials you provided. In order to be reconsidered, please reply to this email with <strong>valid and verifiable credentials</strong>, such as:</p>
          <ul>
            <li>Medical license certificates</li>
            <li>Board certifications</li>
            <li>Government-issued identification</li>
            <li>Other relevant credentials</li>
          </ul>
          <p>We value authenticity and transparency to ensure trust and safety across our platform.</p>
          <p>If you believe this decision was made in error or have additional documents to support your application, please respond to this email or contact our support team.</p>
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

router.post("/applicationRejection", async (req, res) => {
  const { email, doctorName } = req.body;

  try {
    await transporter.sendMail({
      to: email,
      subject: "Your HealthTok Application Has Been Declined",
      html: generateRejectionEmailTemplate(doctorName),
    });

    console.log("Email sent");

    return res.status(200).json({
      message: "mail sent was successful"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Auth failed",
    });
  }
});

module.exports = router;
