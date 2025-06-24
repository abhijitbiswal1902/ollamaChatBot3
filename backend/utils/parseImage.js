const sharp = require("sharp");
const Tesseract = require("tesseract.js");

module.exports = async function parseImage(filePath) {
  try {
    console.log(`[parseImage] 📷 Starting OCR for: ${filePath}`);

    // Enhance image for better OCR results
    const enhancedBuffer = await sharp(filePath)
      .grayscale()
      .normalize()
      .toBuffer();

    const result = await Tesseract.recognize(enhancedBuffer, 'eng');
    const rawText = result.data.text.trim();

    if (!rawText) throw new Error('No text could be extracted from the image');

    const lines = rawText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    console.log(`[parseImage] ✅ OCR complete. Extracted ${lines.length} lines.`);
    return { type: 'image', content: lines.join('\n') };
  } catch (err) {
    console.error('[parseImage] ❌ OCR failed:', err.message);
    throw new Error('Failed to parse image file using OCR');
  }
};
