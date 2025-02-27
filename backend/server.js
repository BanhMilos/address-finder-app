const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
require("dotenv").config();

const serviceAccount = require(process.env.FIREBASE_KEY_PATH);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();
app.use(cors());
app.use(express.json());

// Get all locations
app.get("/locations", async (req, res) => {
  try {
    const snapshot = await db.collection("Province_Code").get();
    const provinces = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    snapshot = await db.collection("District_Code").get();
    const districts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    snapshot = await db.collection("Ward_code").get();
    const wards = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json([...provinceData,...districtData,...wardData]);
  } catch (error) {
    res.status(500).json({ error: "Error fetching locations" });
  }
});

// Get all provinces
app.get("/provinces", async (req, res) => {
  try {
    const snapshot = await db.collection("Province_Code").get();
    const provinces = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(provinces);
  } catch (error) {
    res.status(500).json({ error: "Error fetching provinces" });
  }
});

// Get districts by province ID
app.get("/districts/:provinceId", async (req, res) => {
  try {
    const { provinceId } = req.params;
    const snapshot = await db.collection("District_Code").where("ID tỉnh thành", "==", Number(provinceId)).get();
    const districts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(districts);
  } catch (error) {
    res.status(500).json({ error: "Error fetching districts" });
  }
});

// Get wards by district ID
app.get("/wards/:districtId", async (req, res) => {
  try {
    const { districtId } = req.params;
    const snapshot = await db.collection("Ward_code").where("ID Quận huyện", "==", Number(districtId)).get();
    const wards = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(wards);
  } catch (error) {
    res.status(500).json({ error: "Error fetching wards" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
