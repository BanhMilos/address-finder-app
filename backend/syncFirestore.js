require('dotenv').config();

const XLSX = require('xlsx');
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const serviceAccount = require(process.env.FIREBASE_KEY_PATH);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://hungan-mdctest.firebaseio.com'
});

const db = admin.firestore();

// Log
const LOG_FILE = path.join(__dirname, 'sync_log.txt');

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

// Sync Firestore
const syncExcelToFirestore = async () => {
  const filePath = path.join(__dirname, "..", "data", "Addresses.xlsx");
  const sheetsData = readExcelFile(filePath);

  logToFile(` Sync started for file: ${filePath}`);

  for (const [sheetName, jsonData] of Object.entries(sheetsData)) {
    const collectionName = sheetName.replace(/\s+/g, "_"); 
    logToFile(` Syncing sheet: ${sheetName} to Firestore: ${collectionName}`);

    if (jsonData.length === 0) {
      logToFile(` Skipping "${sheetName}" (empty sheet)`);
      continue;
    }

    const idColumn = Object.keys(jsonData[0])[0];
    logToFile(` Using "${idColumn}" as document ID for collection "${collectionName}"`);

    const excelDataMap = new Map();
    jsonData.forEach((item) => {
      const id = String(item[idColumn]); 
    
      if (id) {
        item["ID tỉnh thành"] = String(item["ID tỉnh thành"]);    
        excelDataMap.set(id, item);
      }
    });

    const collectionRef = db.collection(collectionName);
    const snapshot = await collectionRef.get();

    const batch = db.batch();
    const firestoreIds = new Set();


    // Update existing and remove missing documents
    snapshot.forEach((doc) => {
      const docId = doc.id;
      firestoreIds.add(docId);

      if (excelDataMap.has(docId)) {
        const newData = excelDataMap.get(docId);
        const existingData = doc.data();

        if (JSON.stringify(existingData) !== JSON.stringify(newData)) {
          batch.set(collectionRef.doc(docId), newData, { merge: true });
          logToFile(` Updated: ${docId}`);
        }

        excelDataMap.delete(docId);
      } else {
        batch.delete(collectionRef.doc(docId));
        logToFile(` Deleted: ${docId}`);
      }
    });


    // Add new documents
    excelDataMap.forEach((newData, docId) => {
      batch.set(collectionRef.doc(docId), newData);
      logToFile(` Added: ${docId}`);
    });

    await batch.commit();
    logToFile(` Firestore collection "${collectionName}" is syncing\n`);
  }

  logToFile(` Sync completed successfully\n`);
};

// Run the goddam function
syncExcelToFirestore().catch((error) => {
  logToFile(` ERROR: ${error.message}`);
  console.error(error);
});
