import express from "express";
import puppeteer from "puppeteer";
import cors from "cors";

const app = express();

/* =========================================================
   CORS FIX (must be first middleware)
   ========================================================= */

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(cors());

// handle preflight requests explicitly
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }

    next();
});

app.use(express.json());

app.get("/", (req, res) => {
    res.send("PDF server running ✅");
});

/* =========================================================
   PDF ROUTE
   ========================================================= */

app.post("/api/generate-pdf", async (req, res) => {
    try {
        const { url } = req.body;

        // PASTE YOUR BASE64 STRING HERE (without the data:image/png;base64, prefix)
        const logoBase64 = "PASTE_HEre"
        if (!url) {
            return res.status(400).json({ error: "URL required" });
        }

        console.log("Generating PDF for:", url);

        const browser = await puppeteer.launch({
            headless: "new",
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
        });

        const page = await browser.newPage();

        await page.goto(url, {
            waitUntil: "domcontentloaded",
            timeout: 60000
        });

        await new Promise(resolve => setTimeout(resolve, 3000));

        await page.emulateMediaType("print");

        const proposalCode = req.body.proposalCode || "PROPOSAL";
        const clientName = req.body.clientName || "Client";

        const pdf = await page.pdf({
            format: "A4",
            printBackground: true,

            margin: {
                top: "160px",      // 110px header height + 20px spacer below header
                bottom: "90px",
                left: "15mm",
                right: "15mm"
            },

            displayHeaderFooter: true,

            /* ================= HEADER ================= */
            headerTemplate: `
<div style="
  width: 100%;
  font-family: Arial, sans-serif;
">
  <!-- Header content row -->
  <div style="
    padding: 10px 25px;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: Arial, sans-serif;
  ">
    <!-- Logo -->
    <div style="display: flex; align-items: center; gap: 10px; font-family: Arial, sans-serif;">
      <img src="data:image/png;base64,${logoBase64}"
           style="height: 80px;" />
    </div>

    <!-- Right side text -->
    <div style="font-size: 11px; text-align: right; font-family: Arial, sans-serif;">
      <div style="font-weight: 600; color: #1b5480; font-family: Arial, sans-serif;">
        Proposal Code: ${proposalCode}
      </div>
      <div style="font-weight: 600; color: #1b5480; font-family: Arial, sans-serif;">
        www.mihiraenergysolutions.com
      </div>
    </div>
  </div>

  <!-- Spacer below header border — increase height for more gap -->
  <div style="height: 20px; font-family: Arial, sans-serif;"></div>
</div>
`,

            /* ================= FOOTER ================= */
            footerTemplate: `
<div style="
  width: 100%;
  font-size: 10px;
  padding: 10px 25px;
  border-top: 1px solid #e5e7eb;
  text-align: center;
  font-family: Arial, sans-serif;
">
  Page <span class="pageNumber"></span> of
  <span class="totalPages"></span>
</div>
`
        });

        await browser.close();

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=proposal.pdf"
        );

        res.send(pdf);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "PDF generation failed" });
    }
});

/* ========================================================= */

app.listen(5052, () => {
    console.log("PDF server running → http://localhost:5052");
});