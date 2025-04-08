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

router.post("/depositCancelled", async (req, res) => {
  const { email, name, amount } = req.body;

  const mailOptions = {
    from: process.env.email,
    to: email,
    subject: "Leadway Deposit Cancelled",
    html: `<div style="background-color: #f4f6f8; padding: 40px 0; font-family: Arial, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08); overflow: hidden;">

    <!-- Header -->
    <div style="background-color: #1D2330; padding: 24px; text-align: center;">
      <img src="https://res.cloudinary.com/rukkiecodes/image/upload/v1741265526/leadway/logo_hhzua0.png" alt="Leadway Finance" style="height: 40px;" />
    </div>

    <!-- Content -->
    <div style="padding: 32px; color: #1D2330;">
      <h2 style="margin-top: 0;">Deposit Cancelled ❌</h2>

      <p style="font-size: 16px;">
        Hello <strong>${name}</strong>,
      </p>

      <p style="font-size: 16px;">
        Your request to deposit <strong style="color: #1D2330;">${amount}</strong> has been cancelled and no funds were added to your wallet.
      </p>

      <p style="font-size: 16px;">
        If you didn’t initiate this action or think this was a mistake, please reach out to our support team.
      </p>

      <p style="margin-top: 40px; font-size: 15px;">
        Stay financially empowered 💼
      </p>

      <p style="font-size: 15px; margin-top: 16px;">
        — The Leadway Finance Team
      </p>
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
