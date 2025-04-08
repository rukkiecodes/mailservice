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

router.post("/withdrawCompleted", async (req, res) => {
  const { email, name, amount } = req.body;

  const mailOptions = {
    from: `"Leadway Finance" ${process.env.email}`,
    to: email,
    subject: "Withdrawal Completed Successfully",
    html: `
      <div style="background-color: #f4f6f8; padding: 40px 0; font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08); overflow: hidden;">
          
          <!-- Header -->
          <div style="background-color: #1D2330; padding: 24px; text-align: center;">
            <img src="https://res.cloudinary.com/rukkiecodes/image/upload/v1741265526/leadway/logo_hhzua0.png" alt="Leadway Finance" style="height: 40px;" />
          </div>
          
          <!-- Body -->
          <div style="padding: 32px; color: #1D2330;">
            <h2 style="margin-top: 0;">Withdrawal Successful ✅</h2>

            <p style="font-size: 16px;">Hello <strong>${name}</strong>,</p>

            <p style="font-size: 16px;">
              Your withdrawal of <strong style="color: #1D2330;">${amount}</strong> has been successfully processed. The funds should reflect in your designated account shortly.
            </p>

            <p style="font-size: 16px;">
              If you have any concerns or didn’t authorize this transaction, please contact our support team immediately.
            </p>

            <p style="margin-top: 40px; font-size: 15px;">
              Keep taking charge of your finances 💰
            </p>

            <p style="font-size: 15px; margin-top: 16px;">
              — The Leadway Finance Team
            </p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send({ success: true, message: "Withdrawal email sent." });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "Failed to send email", error });
  }
});


module.exports = router;
