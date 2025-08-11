const router = require("express").Router();
const path = require("path");
const puppeteer = require("puppeteer");
const ejs = require("ejs");

// Add generate statement
router.post("/generate-pdf", async (req, res) => {
  try {
    const { profile, invoices, receipts, quotations, inventory, customers } =
      req.body;

    const html = await ejs.renderFile(
      path.join(process.cwd(), "templates/pdfTemplate.ejs"),
      {
        profile,
        
        invoices,
        receipts,
        quotations,
        
        inventory,
        customers,
      }
    );

    // Generate PDF with Puppeteer
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });
    await browser.close();

    // Send PDF back to user
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=recido-user-data.pdf",
    });
    res.send(pdfBuffer);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
