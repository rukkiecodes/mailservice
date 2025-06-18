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

const generateOTP = () => `${Math.floor(1000 + Math.random() * 9000)}`;

const generateEmailTemplate = (otp) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>OTP Verification - HealthTok</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f1f7f6;
          margin: 0;
          padding: 0;
        }
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        .email-header {
          text-align: center;
          background-color: #4CAF50;
          padding: 20px;
          border-radius: 10px 10px 0 0;
          color: #ffffff;
        }
        .email-header h1 {
          margin: 0;
          font-size: 24px;
        }
        .email-body {
          padding: 20px;
          color: #333;
          font-size: 16px;
        }
        .otp-code {
          font-size: 28px;
          font-weight: bold;
          color: #4CAF50;
          padding: 10px;
          border: 2px solid #4CAF50;
          border-radius: 6px;
          text-align: center;
        }
        .email-footer {
          text-align: center;
          padding: 20px;
          font-size: 12px;
          color: #777;
        }
        .email-footer a {
          color: #4CAF50;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          <h1>HealthTok</h1>
        </div>
        <div class="email-body">
          <h2>Hello,</h2>
          <p>We received a request to verify your email for the HealthTok app. Your One-Time Password (OTP) is:</p>
          <p class="otp-code">${otp}</p>
          <p>Please use this code to complete the verification process. The code is valid for the next 10 minutes.</p>
          <p>If you did not request this, you can safely ignore this email.</p>
        </div>
        <div class="email-footer">
          <p>Need help? Contact us at <a href="mailto:support@healthTok.com">support@healthTok.com</a></p>
          <p>&copy; 2024 HealthTok. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

router.post("/OTP", async (req, res) => {
  const { email } = req.body;

  try {
    let user = await User.findOne({ email });

    let _id = new mongoose.Types.ObjectId();

    // Create new user if not found
    if (!user) {
      const newUser = {
        _id,
        email,
        verified: false,
      };
      user = await User.create(newUser);
    }

    // Generate OTP
    const otp = generateOTP();

    // Hash OTP
    const hashOTP = await bcrypt.hash(otp, 12);

    // Save OTP verification details
    const newOTPVerification = new userOTPVerification({
      userId: _id,
      otp: hashOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    });

    await newOTPVerification.save();

    // Send email with OTP
    const emailTemplate = generateEmailTemplate(otp);

    await transporter.sendMail({
      to: email,
      subject: "HealthTok OTP Verification",
      html: emailTemplate,
    });

    return res.status(200).json({
      message: "Authentication was successful",
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Auth failed",
    });
  }
});

module.exports = router;
