const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");
// import portNumber from './portNumber';
const portNumber = require('./portNumber');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = portNumber.PORT;

app.get('/',(req,res)=>{
  res.send("Connceted to server");
})

app.post("/scrape", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "No URL provided" });

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--disable-http2"],
    });
    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );
    await page.setExtraHTTPHeaders({
      "Accept-Language": "en-US,en;q=0.9",
      "Accept-Encoding": "gzip, deflate, br",
      Connection: "keep-alive",
    });
    await page.goto(url, { waitUntil: "networkidle2" });

    let bodyText = await page.evaluate(() => document.body.innerText);

    await browser.close();

    res.json({ text: bodyText });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
