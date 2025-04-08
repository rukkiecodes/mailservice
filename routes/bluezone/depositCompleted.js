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

router.post("/depositCompleted", async (req, res) => {
  const { email, name, amount } = req.body;

  const mailOptions = {
    from: "Bluezone Finance",
    to: email,
    subject: "Bluezone Deposit Completed",
    html: `<div style="background-color: #f4f6f8; padding: 40px 0; font-family: Arial, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08); overflow: hidden;">

    <!-- Header -->
    <div style="background-color: #1D2330; padding: 24px; text-align: center;">
      <img src="https://res.cloudinary.com/rukkiecodes/image/upload/v1741265526/leadway/logo_hhzua0.png" alt="Bluezone Finance" style="height: 40px;" />
    </div>

    <!-- Content -->
    <div style="padding: 32px; color: #1D2330;">
      <h2 style="margin-top: 0;">Deposit Successful ✅</h2>

      <p style="font-size: 16px;">
        Hello <strong>${name}</strong>,
      </p>

      <p style="font-size: 16px;">
        Your deposit of <strong style="color: #1D2330;">${amount}</strong> has been successfully processed and added to your wallet.
      </p>

      <p style="font-size: 16px;">
        You can now view your updated wallet balance in the Bluezone Finance app.
      </p>

      <p style="margin-top: 40px; font-size: 15px;">
        Thanks for banking with Bluezone Finance.
      </p>

      <p style="font-size: 15px; margin-top: 16px;">
        — The Bluezone Finance Team
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
