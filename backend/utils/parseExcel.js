// const XLSX = require("xlsx");

// module.exports = function parseExcel(buffer) {
//   try {
//     const workbook = XLSX.read(buffer, { type: "buffer" });
//     let text = "";

//     workbook.SheetNames.forEach((sheet) => {
//       const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet], { header: 1 });
//       text += `Sheet: ${sheet}\n`;
//       sheetData.forEach((row, i) => {
//         text += `Row ${i + 1}: ${row.join(" | ")}\n`;
//       });
//     });

//     return text.trim();
//   } catch (err) {
//     console.error("[parseExcel] ❌ Error parsing Excel file:", err.message);
//     return "";
//   }
// };

// Import the 'xlsx' library to handle Excel (.xlsx) file parsing
const XLSX = require("xlsx");

// Export a function that takes a buffer (Excel file content in binary form)
module.exports = function parseExcel(buffer) {
  try {
    // Read the Excel buffer into a workbook object using 'buffer' as input type
    const workbook = XLSX.read(buffer, { type: "buffer" });

    // Initialize an empty string to accumulate parsed text content
    let text = "";

    // Iterate over each sheet name in the workbook
    workbook.SheetNames.forEach((sheet) => {
      // Convert the current sheet to a 2D array of rows (header: 1 returns arrays instead of objects)
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet], { header: 1 });

      // Add the sheet name to the output text
      text += `Sheet: ${sheet}\n`;

      // Iterate through each row in the sheet
      sheetData.forEach((row, i) => {
        // Join cell values with ' | ' and prepend the row number
        text += `Row ${i + 1}: ${row.join(" | ")}\n`;
      });
    });

    // Return the final text after trimming any trailing whitespace
    return text.trim();
  } catch (err) {
    // If any error occurs during parsing, log the error and return an empty string
    console.error("[parseExcel] ❌ Error parsing Excel file:", err.message);
    return "";
  }
};
