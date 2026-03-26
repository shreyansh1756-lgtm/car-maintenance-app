const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect(
  "mongodb+srv://shreyansh1756_db_user:aaabb@cluster0.ze11qd7.mongodb.net/carDB?retryWrites=true&w=majority"
)
.then(() => {
  console.log("MongoDB Connected ✅");
})
.catch((err) => {
  console.log("MongoDB Error ❌", err);
});

// ✅ Vehicle Schema
const Vehicle = mongoose.model("Vehicle", {
  brand: String,
  model: String,
  year: Number,
  mileage: Number,
});

// ✅ Maintenance Schema
const Maintenance = mongoose.model("Maintenance", {
  vehicle_id: String,   // 🔥 correct field
  service_type: String,
  service_date: String,
  cost: Number,
});

// ✅ Root Route
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// ✅ Add Vehicle
app.post("/addVehicle", async (req, res) => {
  try {
    const v = new Vehicle(req.body);
    await v.save();
    res.send(v);
  } catch (err) {
    res.status(500).send(err);
  }
});

// ✅ Get Vehicles
app.get("/vehicles", async (req, res) => {
  try {
    const data = await Vehicle.find();
    res.send(data);
  } catch (err) {
    res.status(500).send(err);
  }
});

// ✅ Add Maintenance
app.post("/addMaintenance", async (req, res) => {
  try {
    const m = new Maintenance(req.body);
    await m.save();
    res.send(m);
  } catch (err) {
    res.status(500).send(err);
  }
});

// ✅ Get Maintenance for Vehicle
app.get("/maintenance/:vehicleId", async (req, res) => {
  try {
    const data = await Maintenance.find({
      vehicle_id: req.params.vehicleId, // 🔥 correct
    });
    res.send(data);
  } catch (err) {
    res.status(500).send(err);
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});