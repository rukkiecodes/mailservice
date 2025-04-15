const router = require("express").Router();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../../models/user");
const userOTPVerification = require("../../models/userOTPVerification");
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

router.post("/OTP", async (req, res) => {
  const { email } = req.body;

  try {
    let user = await User.findOne({ email });

    let _id = new mongoose.Types.ObjectId();

    let newUser = {
      _id,
      email,
      verified: false,
    };

    user = await User.create(newUser);

    // send mail
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

    const hashOTP = await bcrypt.hash(otp, 12);

    const newOTPVerification = await new userOTPVerification({
      userId: _id,
      otp: hashOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    });

    await newOTPVerification.save();

    transporter
      .sendMail({
        to: email,
        subject: "Luxury OTP Verification",
        html: `
                <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OTP Verification - Luxury</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .email-header {
      text-align: center;
      background-color: #7D3FE2;
      padding: 20px;
      border-radius: 8px 8px 0 0;
      color: #ffffff;
    }
    .email-header h1 {
      margin: 0;
    }
    .email-body {
      padding: 20px;
      color: #333333;
    }
    .otp-code {
      font-size: 24px;
      font-weight: bold;
      color: #7D3FE2;
    }
    .email-footer {
      text-align: center;
      padding: 20px;
      font-size: 12px;
      color: #777777;
    }
    .email-footer a {
      color: #7D3FE2;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>Luxury</h1>
    </div>
    <div class="email-body">
      <h2>Hello,</h2>
      <p>We received a request to verify your email for the Luxury app.</p>
      <p>Your One-Time Password (OTP) is:</p>
      <p class="otp-code">${otp}</p>
      <p>Please use this code to complete the verification process. The code is valid for the next 10 minutes.</p>
      <p>If you didn't request this, you can safely ignore this email.</p>
    </div>
    <div class="email-footer">
      <p>Need help? Contact us at <a href="mailto:support@luxury.com">support@luxury.com</a></p>
      <p>&copy; 2024 Luxury. All rights reserved.</p>
    </div>
  </div>
</body>
</html>

                `,
      })
      .then(() => {
        console.log("Email sent");

        return res.status(200).json({
          message: "Authentication was successful",
          user,
        });
      })
      .catch((error) => {
        console.log(error);

        return res.status(500).json({
          message: error.message,
        });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Auth failed",
    });
  }
});

module.exports = router;
