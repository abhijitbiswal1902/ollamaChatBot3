

// Import the 'pdf2table' library, which extracts tables from PDFs
const pdf2table = require("pdf2table");

/**
 * Parses a tabular PDF like call/data statements
 * @param {Buffer} buffer - PDF file buffer input
 * @returns {Promise<string>} - Parsed table content in a human-readable format
 */
module.exports = async function parsePDF(buffer) {
  // Return a new promise that resolves with the formatted table string
  return new Promise((resolve, reject) => {
    // Use pdf2table to parse the PDF buffer
    pdf2table.parse(buffer, (err, rows) => {
      // Handle any parsing errors
      if (err) {
        console.error("[parsePDF] ❌ Error parsing table PDF:", err.message);
        return reject("Failed to extract tables from PDF.");
      }

      // If no rows (no table data), resolve with a fallback message
      if (!rows || rows.length === 0) {
        return resolve("No table data found in PDF.");
      }

      // Initialize an empty string to accumulate the parsed table output
      let output = "";

      // Variable to track the last identified header row
      let lastHeader = [];

      // Iterate over each row extracted from the PDF
      rows.forEach((row, index) => {
        // Heuristic: If the row contains alphabetic characters and has at least 4 columns,
        // treat it as a header row
        if (row.some(cell => /[a-zA-Z]/.test(cell)) && row.length >= 4) {
          lastHeader = row; // Update lastHeader
          // Add the header row and a separator line
          output += `\n\n${row.join(" | ")}\n${"-".repeat(80)}\n`;
        } 
        // If it's a data row and matches the header structure, add it as well
        else if (lastHeader.length > 0 && row.length === lastHeader.length) {
          output += row.join(" | ") + "\n";
        }
      });

      // Trim any trailing whitespace and resolve the final formatted table output
      resolve(output.trim());
    });
  });
};
