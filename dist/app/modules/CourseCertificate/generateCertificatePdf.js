"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCertificatePDF = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const generateCertificatePDF = async (html) => {
    const browser = await puppeteer_1.default.launch({
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
exports.generateCertificatePDF = generateCertificatePDF;
//# sourceMappingURL=generateCertificatePdf.js.map