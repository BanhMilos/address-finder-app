const express = require('express');
const router = express.Router();
const xlsx = require('xlsx');
const path = require('path');

// Load the Excel file
const workbook = xlsx.readFile(path.join(__dirname, '../../data/Addresses.xlsx'));
const sheetName = workbook.SheetNames[0];
const addresses = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

// Get provinces
router.get('/provinces', (req, res) => {
    const provinces = [...new Set(addresses.map(address => address.Province))];
    res.json(provinces);
});

// Get districts based on selected province
router.get('/districts/:province', (req, res) => {
    const { province } = req.params;
    const districts = [...new Set(addresses.filter(address => address.Province === province).map(address => address.District))];
    res.json(districts);
});

// Get communes based on selected district
router.get('/communes/:district', (req, res) => {
    const { district } = req.params;
    const communes = [...new Set(addresses.filter(address => address.District === district).map(address => address.Commune))];
    res.json(communes);
});

// Get specific addresses based on selected commune
router.get('/addresses/:commune', (req, res) => {
    const { commune } = req.params;
    const specificAddresses = addresses.filter(address => address.Commune === commune);
    res.json(specificAddresses);
});

module.exports = router;