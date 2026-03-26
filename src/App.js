import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

function App() {
  const API_URL = "https://car-maintenance-app-ptbt.onrender.com";

  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [mileage, setMileage] = useState("");
  const [vehicles, setVehicles] = useState([]);

  const [serviceType, setServiceType] = useState("");
  const [serviceDate, setServiceDate] = useState("");
  const [cost, setCost] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [maintenance, setMaintenance] = useState([]);

  const [darkMode, setDarkMode] = useState(true);

  // Fetch vehicles
  const fetchVehicles = async () => {
    const res = await fetch(`${API_URL}/vehicles`);
    const data = await res.json();
    setVehicles(data);
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // Fetch maintenance when vehicle changes
  useEffect(() => {
    if (selectedVehicle) {
      fetchMaintenance(selectedVehicle._id);
    }
  }, [selectedVehicle]);

  // Add vehicle
  const addVehicle = async () => {
    await fetch(`${API_URL}/addVehicle`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ brand, model, year, mileage }),
    });

    fetchVehicles();
    setBrand("");
    setModel("");
    setYear("");
    setMileage("");
  };

  // Fetch maintenance
  const fetchMaintenance = async (vehicleId) => {
    const res = await fetch(`${API_URL}/maintenance/${vehicleId}`);
    const data = await res.json();
    setMaintenance(data);
  };

  // Add maintenance
  const addMaintenance = async () => {
    if (!selectedVehicle) return alert("Select vehicle first");

    await fetch(`${API_URL}/addMaintenance`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        vehicle_id: selectedVehicle._id,
        service_type: serviceType,
        service_date: serviceDate,
        cost,
      }),
    });

    await fetchMaintenance(selectedVehicle._id);

    setServiceType("");
    setServiceDate("");
    setCost("");
  };

  // Due status
  const getDueStatus = (date, type) => {
    const today = new Date();
    const lastDate = new Date(date);

    let interval = 90;
    if (type === "Brake Check") interval = 180;

    const nextDate = new Date(lastDate);
    nextDate.setDate(nextDate.getDate() + interval);

    const diff = (nextDate - today) / (1000 * 60 * 60 * 24);

    if (diff < 0) return "❌ Overdue";
    if (diff < 7) return "⚠ Due Soon";
    return "✅ OK";
  };

  // Health score
  const calculateHealth = () => {
    let score = 100;

    maintenance.forEach((m) => {
      const status = getDueStatus(m.service_date, m.service_type);
      if (status.includes("Overdue")) score -= 30;
      else if (status.includes("Due")) score -= 15;
    });

    return score < 0 ? 0 : score;
  };

  // Chart data
  const chartData = {
    labels: maintenance.map((m) => m.service_date),
    datasets: [
      {
        label: "Maintenance Cost",
        data: maintenance.map((m) => m.cost),
        borderColor: "#22c55e",
        tension: 0.3,
      },
    ],
  };

  // Styles
  const card = {
    background: darkMode ? "#1e293b" : "#fff",
    padding: "20px",
    marginBottom: "20px",
    borderRadius: "12px",
    boxShadow: darkMode
      ? "0 4px 20px rgba(0,0,0,0.4)"
      : "0 4px 10px rgba(0,0,0,0.1)",
  };

  const input = {
    width: "100%",
    padding: "10px",
    margin: "6px 0",
    borderRadius: "8px",
    border: darkMode ? "1px solid #334155" : "1px solid #ccc",
    background: darkMode ? "#0f172a" : "#fff",
    color: darkMode ? "#fff" : "#000",
  };

  const button = {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    marginTop: "8px",
    fontWeight: "bold",
    background: "#22c55e",
    color: "#fff",
  };

  return (
    <div
      style={{
        padding: "20px",
        background: darkMode ? "#0f172a" : "#f4f6f8",
        color: darkMode ? "#fff" : "#000",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ textAlign: "center" }}>🚗 Car Maintenance</h1>

      <button onClick={() => setDarkMode(!darkMode)} style={button}>
        Toggle {darkMode ? "Light" : "Dark"} Mode
      </button>

      {/* Dashboard */}
      {selectedVehicle && (
        <div style={card}>
          <h2>Dashboard</h2>
          <p>🚘 {selectedVehicle.brand} {selectedVehicle.model}</p>
          <p>📊 Mileage: {selectedVehicle.mileage} km</p>
          <p><b>❤️ Health: {calculateHealth()}%</b></p>
        </div>
      )}

      {/* Add Vehicle */}
      <div style={card}>
        <h2>Add Vehicle</h2>
        <input style={input} placeholder="Brand" value={brand} onChange={(e) => setBrand(e.target.value)} />
        <input style={input} placeholder="Model" value={model} onChange={(e) => setModel(e.target.value)} />
        <input style={input} placeholder="Year" value={year} onChange={(e) => setYear(e.target.value)} />
        <input style={input} placeholder="Mileage" value={mileage} onChange={(e) => setMileage(e.target.value)} />
        <button style={button} onClick={addVehicle}>Add Vehicle</button>
      </div>

      {/* Select Vehicle */}
      <div style={card}>
        <h2>Select Vehicle</h2>
        {vehicles.map((v) => (
          <div
            key={v._id}
            onClick={() => setSelectedVehicle(v)}
            style={{
              cursor: "pointer",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "5px",
              background:
                selectedVehicle?._id === v._id
                  ? "#22c55e"
                  : darkMode ? "#1e293b" : "#e2e8f0",
              color: "#fff",
            }}
          >
            🚘 {v.brand} {v.model}
          </div>
        ))}
      </div>

      {/* Add Maintenance */}
      <div style={card}>
        <h2>Add Maintenance</h2>
        <input style={input} placeholder="Service Type" value={serviceType} onChange={(e) => setServiceType(e.target.value)} />
        <input style={input} type="date" value={serviceDate} onChange={(e) => setServiceDate(e.target.value)} />
        <input style={input} placeholder="Cost" value={cost} onChange={(e) => setCost(e.target.value)} />
        <button style={button} onClick={addMaintenance}>Add Service</button>
      </div>

      {/* Chart */}
      <div style={card}>
        <h2>Maintenance Chart 📊</h2>
        <Line data={chartData} />
      </div>

      {/* History */}
      <div style={card}>
        <h2>Maintenance History</h2>
        {maintenance.map((m) => (
          <div key={m._id}>
            <b>{m.service_type}</b> — ₹{m.cost}
            <br />
            {m.service_date} — {getDueStatus(m.service_date, m.service_type)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;