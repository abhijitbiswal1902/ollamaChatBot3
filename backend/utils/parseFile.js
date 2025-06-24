const fs = require('fs');
const path = require('path');
const parsePDF = require('./parsePDF');
const parseExcel = require('./parseExcel');
const parseImage = require('./parseImage');
const { parse } = require('csv-parse/sync');

// TXT
const parseTxt = (filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    console.log(`[parseTxt] ✅ Successfully read .txt file`);
    return { type: 'text', content: content.trim() };
  } catch (err) {
    console.error('[parseTxt] ❌ Error reading .txt file:', err);
    throw new Error('Failed to read .txt file');
  }
};

// CSV
const parseCsv = (filePath) => {
  try {
    const csvString = fs.readFileSync(filePath, 'utf-8');
    const records = parse(csvString, {
      columns: true,
      skip_empty_lines: true,
    });
    console.log(`[parseCsv] ✅ Successfully parsed CSV to JSON`);
    return { type: 'csv', content: JSON.stringify(records, null, 2) };
  } catch (err) {
    console.error('[parseCsv] ❌ Error parsing CSV file:', err);
    throw new Error('Failed to parse .csv file');
  }
};

// Main file type dispatcher
const parseFile = async (filePath) => {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.txt') return parseTxt(filePath);
  if (ext === '.csv') return parseCsv(filePath);
  if (['.jpg', '.jpeg', '.png'].includes(ext)) return await parseImage(filePath);
  if (ext === '.pdf') {
    const buffer = fs.readFileSync(filePath);
    const content = await parsePDF(buffer);
    return { type: 'pdf', content };
  }
  if (ext === '.xlsx') {
    const buffer = fs.readFileSync(filePath);
    const content = parseExcel(buffer);
    return { type: 'excel', content };
  }

  throw new Error('❌ Unsupported file type. Supported: .txt, .csv, .pdf, .xlsx, .jpg, .png');
};

module.exports = parseFile;
