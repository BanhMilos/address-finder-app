const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const DATA_PATH = path.join(__dirname, "..", "data");

// Read JSON file
const readJsonFile = (fileName) => {
  const filePath = path.join(DATA_PATH, fileName);
  if (!fs.existsSync(filePath)) {
    console.error(`Error: ${fileName} not found.`);
    return [];
  }

  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    console.error(`Error reading ${fileName}:`, error);
    return [];
  }
};

// Load data
const provinceData = readJsonFile("Province_Code.json");
const districtData = readJsonFile("District_Code.json");
const wardData = readJsonFile("Ward_Code.json");

// Get all provinces
app.get("/provinces", (req, res) => {
  res.json(provinceData);
});

// Get districts by province ID
app.get("/districts/:provinceId", (req, res) => {
  const { provinceId } = req.params;
  const districts = districtData.filter((district) => district["ID tỉnh thành"] === Number(provinceId));
  res.json(districts);
});

// Get wards by district ID
app.get("/wards/:districtId", (req, res) => {
  const { districtId } = req.params;
  const wards = wardData.filter((ward) => ward["ID Quận huyện"] === Number(districtId));
  res.json(wards);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
