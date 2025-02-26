const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, 'sync_log.txt');

// LOg
const logToFile = (message) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;

  fs.appendFileSync(LOG_FILE, logMessage, 'utf8');
  console.log(message);
};

// Read all sheets in Excel file
const readExcelFile = (filePath) => {
  const workbook = XLSX.readFile(filePath);
  const sheetsData = {};

  workbook.SheetNames.forEach((sheetName) => {
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet);
    sheetsData[sheetName] = jsonData;
  });

  return sheetsData;
};

// Save to local JSON files
const saveToJSON = (data, folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  Object.entries(data).forEach(([sheetName, jsonData]) => {
    const fileName = `${sheetName.replace(/\s+/g, "_")}.json`;
    const filePath = path.join(folderPath, fileName);

    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), 'utf8');
    logToFile(` Saved: ${filePath}`);
  });
};

// Sync local
const syncExcelToJSON = () => {
  const filePath = path.join(__dirname, "..", "data", "Addresses.xlsx");
  const outputFolder = path.join(__dirname, "..", "data");

  logToFile(` Sync started for file: ${filePath}`);

  const sheetsData = readExcelFile(filePath);
  saveToJSON(sheetsData, outputFolder);

  logToFile(` Sync completed successfully\n`);
};

// Run the loco function
syncExcelToJSON();
