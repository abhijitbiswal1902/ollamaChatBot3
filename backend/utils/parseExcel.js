// Import the 'xlsx' library to handle Excel file parsing
const XLSX = require("xlsx");

// Export a function that takes a file buffer and returns plain text extracted from the Excel file
module.exports = function parseExcel(buffer) {
  // Read the Excel file from the provided buffer using 'xlsx'
  const workbook = XLSX.read(buffer, { type: "buffer" });

  // Initialize an empty string to store extracted text
  let text = "";

  // Iterate through each sheet in the workbook
  workbook.SheetNames.forEach((sheet) => {
    // Convert the current sheet to CSV format (plain text)
    const data = XLSX.utils.sheet_to_csv(workbook.Sheets[sheet]);

    // Append the sheet name and its data to the result text
    text += `Sheet: ${sheet}\n${data}\n`;
  });

  // Return the full text extracted from all sheets in the Excel file
  return text;
};
