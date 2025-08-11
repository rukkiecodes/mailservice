const router = require("express").Router();
const path = require("path");
const ejs = require("ejs");
// const puppeteer = require("puppeteer-core");
// const chromium = require("@sparticuz/chromium-min");

const puppeteer =
  process.env.NODE_ENV === "production"
    ? require("puppeteer-core")
    : require("puppeteer");
const chromium = require("@sparticuz/chromium-min");

router.post("/generate-pdf", async (req, res) => {
  const { profile, invoices, receipts, quotations, inventory, customers } =
    req.body;

  const html = await ejs.renderFile(
    path.join(process.cwd(), "templates/pdfTemplate.ejs"),
    { profile, invoices, receipts, quotations, inventory, customers }
  );

  const browser = await puppeteer.launch(
    process.env.NODE_ENV === "production"
      ? {
          args: chromium.args,
          defaultViewport: chromium.defaultViewport,
          executablePath: await chromium.executablePath(),
          headless: chromium.headless,
        }
      : { headless: true } // Local: puppeteer auto-downloads Chrome
  );

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });
  const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
  await browser.close();

  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": "attachment; filename=recido-user-data.pdf",
  });
  res.send(pdfBuffer);
});

module.exports = router;
