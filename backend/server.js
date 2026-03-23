const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 PASTE YOUR MONGODB URL HERE
mongoose.connect(
 " mongodb+srv://shreyansh1756_db_user:abc123@cluster0.ze11qd7.mongodb.net/?appName=Cluster0"
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log("MongoDB Error ❌", err));

const Vehicle = mongoose.model("Vehicle", {
  brand: String,
  model: String,
  year: Number,
  mileage: Number,
});

const Maintenance = mongoose.model("Maintenance", {
  vehicle_id: String,
  service_type: String,
  service_date: String,
  cost: Number,
});

// Root
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// Add vehicle
app.post("/addVehicle", async (req, res) => {
  const v = new Vehicle(req.body);
  await v.save();
  res.send(v);
});

// Get vehicles
app.get("/vehicles", async (req, res) => {
  const data = await Vehicle.find();
  res.send(data);
});

// Add maintenance
app.post("/addMaintenance", async (req, res) => {
  const m = new Maintenance(req.body);
  await m.save();
  res.send(m);
});

// Get maintenance
app.get("/maintenance/:vehicleId", async (req, res) => {
  const data = await Maintenance.find({
    vehicle_id: req.params.vehicleId,
  });
  res.send(data);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});