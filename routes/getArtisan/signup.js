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
    user: process.env.getArtizan_email,
    pass: process.env.getArtizan_APP_PASSWORD,
  },
});

const generateOTP = () => `${Math.floor(1000 + Math.random() * 9000)}`;

const generateEmailTemplate = (otp, email) => {
  return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verification Code</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }

        body {
            width: 600px;
            margin: auto;
            background: #ffffff;
            color: #000;
        }

        .logoContainer {
            padding-top: 3em;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 3em;
        }

        .banner {
            width: 100%;
        }

        .mainSection {
            margin-top: 3em;
        }

        .mainSection h2 {
            margin-bottom: 1em;
            font-size: 1.8rem;
            text-align: center;
        }

        .mainSection p {
            margin-bottom: 0.5em;
            font-size: 1rem;
            text-align: center;
        }

        .otpContainer {
            margin: 3em auto;
            width: 400px;
            display: flex;
            justify-content: center;
        }

        .otpContainer p {
            font-size: 2rem;
            font-weight: 600;
            letter-spacing: 1em;
        }

        .socialsContainer {
            margin-top: 3em;
            border-top: 1px solid #00000033;
            border-bottom: 1px solid #00000033;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 1.5em 0;
        }

        .socialsContainer img {
            width: 24px;
            height: 24px;
            margin: 0 10px;
        }

        footer {
            margin-top: 2em;
            text-align: center;
            font-size: 0.9rem;
            color: #666;
        }
    </style>
</head>

<body>
    <div class="logoContainer">
        <!-- Example SVG logo -->
        <svg class="logo" width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="21" cy="21" r="20" stroke="#320E64" stroke-width="2" />
            <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-size="16" fill="#320E64">W</text>
        </svg>
    </div>

    <img src="https://res.cloudinary.com/rukkiecodes/image/upload/v1721646706/Group_248_s5d6vu.png" alt="Banner" class="banner" />

    <div class="mainSection">
        <h2>Your Verification Code</h2>
        <p>Please use the code below to complete your sign-in process.</p>
    </div>

    <div class="otpContainer">
        <p>${otp}</p>
    </div>
</body>

</html>
`;
};

router.post("/signup", async (req, res) => {
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
    const emailTemplate = generateEmailTemplate(otp, email);

    await transporter.sendMail({
      to: email,
      subject: "Artisan OTP Verification",
      html: emailTemplate,
    });

    return res.status(200).json({
      message: "Authentication was successful",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Auth failed",
    });
  }
});

module.exports = router;
