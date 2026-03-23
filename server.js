const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./car.db");

// Create tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS vehicles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brand TEXT,
      model TEXT,
      year INTEGER,
      mileage INTEGER
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS maintenance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vehicle_id INTEGER,
      service_type TEXT,
      service_date TEXT,
      cost INTEGER
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS service_rules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      service_type TEXT,
      interval_days INTEGER
    )
  `);

  db.run(`
    INSERT OR IGNORE INTO service_rules (service_type, interval_days)
    VALUES
      ('Oil Change', 90),
      ('Brake Check', 180)
  `);
});

// Test route
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// Add vehicle
app.post("/addVehicle", (req, res) => {
  const { brand, model, year, mileage } = req.body;

  db.run(
    `INSERT INTO vehicles (brand, model, year, mileage)
     VALUES (?, ?, ?, ?)`,
    [brand, model, year, mileage],
    function (err) {
      if (err) return res.send(err);
      res.send({ id: this.lastID });
    }
  );
});

// Add maintenance
app.post("/addMaintenance", (req, res) => {
  const { vehicle_id, service_type, service_date, cost } = req.body;

  db.run(
    `INSERT INTO maintenance (vehicle_id, service_type, service_date, cost)
     VALUES (?, ?, ?, ?)`,
    [vehicle_id, service_type, service_date, cost],
    function (err) {
      if (err) return res.send(err);
      res.send({ id: this.lastID });
    }
  );
});

// Get maintenance
app.get("/maintenance/:vehicleId", (req, res) => {
  const { vehicleId } = req.params;

  db.all(
    `SELECT * FROM maintenance WHERE vehicle_id = ?`,
    [vehicleId],
    (err, rows) => {
      if (err) return res.send(err);
      res.send(rows);
    }
  );
});

// Get vehicles
app.get("/vehicles", (req, res) => {
  db.all("SELECT * FROM vehicles", [], (err, rows) => {
    if (err) return res.send(err);
    res.send(rows);
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

console.log("Starting server...");