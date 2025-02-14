const puppeteer = require("puppeteer");


const link = "https://www.zomato.com/hyderabad/desi-street-food-multi-cusine-suchitra/order";

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Set user agent to mimic a real browser
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
  );

  console.log("Opening page...");
  await page.goto(link, { waitUntil: "networkidle2" });

  // Wait for menu items to load
  await page.waitForSelector("body", { timeout: 10000 });

  // Extract body text after JavaScript execution
  let bodyText = await page.evaluate(() => document.body.innerText);

  // Save the extracted text
  fs.writeFileSync("./sample.txt", bodyText, "utf-8");

  console.log("Scraping complete. Data saved in sample.txt");

  await browser.close();
})();
