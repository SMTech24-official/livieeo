import puppeteer from "puppeteer";

export const generateCertificatePDF = async (html: string) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  // Ensure viewport matches A4
  await page.setViewport({ width: 794, height: 1123 }); // A4 @96dpi

  const pdfBuffer = await page.pdf({
    width: "210mm",
    height: "297mm",
    printBackground: true,
    pageRanges: "1", // force single page
    margin: { top: "0", right: "0", bottom: "0", left: "0" },
  });

  await browser.close();
  return pdfBuffer;
};