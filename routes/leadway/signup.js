const router = require("express").Router();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.email,
    pass: process.env.APP_PASSWORD,
  },
});

router.post("/signup", async (req, res) => {
  const { email, name } = req.body;

  const mailOptions = {
    from: "Leadway Finance",
    to: email,
    subject: "Account Creation Successful",
    html: `<div style="background-color: #f4f6f8; padding: 40px 0; font-family: Arial, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08); overflow: hidden;">
    
    <!-- Header with logo -->
    <div style="background-color: #1D2330; padding: 24px; text-align: center;">
      <img src="https://res.cloudinary.com/rukkiecodes/image/upload/v1741265526/leadway/logo_hhzua0.png" alt="Leadway Finance" style="height: 40px;" />
    </div>

    <!-- Main Content -->
    <div style="padding: 32px; color: #1D2330;">
      <h2 style="margin-top: 0;">Welcome to Leadway Finance 🎉</h2>

      <p style="font-size: 16px;">
        Hello <strong>${name}</strong>,
      </p>

      <p style="font-size: 16px;">
        Your account has been successfully created. We’re excited to have you onboard and can't wait for you to explore the tools and services designed to help you grow financially.
      </p>

      <p style="font-size: 16px;">
        Whether you’re here to manage your finances, explore investment opportunities, or track your goals — we’ve got you covered.
      </p>

      <p style="text-align: center; margin: 40px 0;">
        <a href="%DASHBOARD_LINK%" style="background-color: #1D2330; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
          Go to Dashboard
        </a>
      </p>

      <p style="font-size: 15px;">
        If you have any questions or need assistance, feel free to reach out anytime.
      </p>

      <p style="margin-top: 40px; font-size: 15px;">
        Welcome aboard,<br><strong>The Leadway Finance Team</strong>
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color: #f0f2f4; padding: 20px; text-align: center; font-size: 12px; color: #888;">
      You’re receiving this email because you recently created an account with Leadway Finance.
    </div>
  </div>
</div>
`,
  };

  await transporter.sendMail(mailOptions);

  res.status(200).json({
    message: "Email sent",
  });
});

module.exports = router;
