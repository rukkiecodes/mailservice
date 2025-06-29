require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");

const app = express();

app.use(cors());
connectDB();

app.use(
  bodyParser.urlencoded({
    true: false,
    limit: "50mb",
    extended: true,
  })
);

app.use(bodyParser.json({ limit: "50mb" }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use("/bluezone", [
  require("./routes/bluezone/signup"),
  require("./routes/bluezone/deposit"),
  require("./routes/bluezone/depositCompleted"),
  require("./routes/bluezone/depositCanceled"),
  require("./routes/bluezone/withdrawCancelled"),
  require("./routes/bluezone/withdrawCompleted"),
  require("./routes/bluezone/withdrawRequest"),
]);

app.use("/luxi", [
  require("./routes/luxi/OTP"),
  require("./routes/luxi/verifyOTP"),
  require("./routes/luxi/paypal"),
  require("./routes/luxi/braintree"),
  require("./routes/luxi/newDriver"),
  require("./routes/luxi/newRide"),
  require("./routes/luxi/rideCancelled"),
  require("./routes/luxi/depositSuccess"),
  require("./routes/luxi/walletCredited"),
  require("./routes/luxi/transactionFailed"),
  require("./routes/luxi/transactionInProgress"),
  require("./routes/luxi/transactionSuccessPendingWalletCredit"),
  require("./routes/luxi/notifyAdminPendingPayment"),
  require("./routes/luxi/rideAccepted"),
]);

app.use("/healthTok", [
  require("./routes/healthTok/signup"),
  require("./routes/healthTok/verifyOTP"),
  require("./routes/healthTok/applicationRejection"),
  require("./routes/healthTok/applicationApproved"),
  require("./routes/healthTok/applicationSent"),
  //   Stream
  require("./routes/healthTok/stream/register"),

  // paystack
  require("./routes/healthTok/paystack/checkout"),
]);

app.use("/recido", [
  require("./routes/recido/share")
]);

app.use("/artisan", [
  require("./routes/getArtisan/signup"),
  require("./routes/getArtisan/verifyOTP")
]);

app.use("/", [require("./routes/home")]);

// Error handling
app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  console.log(error);
  res.status(status).json({ message: message, data: data });
});

app.use((req, res, next) => {
  const error = new Error("Not found");
  // @ts-ignore
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

const PORT = process.env.PORT || 8000;
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on ${PORT}`)
);
