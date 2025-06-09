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

router.post("/share", async (req, res) => {
  const { email, subject, html } = req.body;

  try {
    await transporter.sendMail({
      to: email,
      subject,
      html,
    });

    res.status(200).json({ message: "Deposit email sent successfully" });
  } catch (error) {
    console.error("Error sending deposit email:", error);
    res
      .status(500)
      .json({ message: "Failed to send deposit email", error: error.message });
  }
});

module.exports = router;
