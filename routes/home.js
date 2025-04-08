const router = require("express").Router();

router.get("/", async (req, res) => {
  res.send('Hello from mailing service. The server is up')
});

module.exports = router;
