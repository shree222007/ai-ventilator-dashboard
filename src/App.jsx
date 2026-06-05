import "./App.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

function App() {
  const spo2Data = {
    labels: ["10s", "8s", "6s", "4s", "2s", "Now"],
    datasets: [
      {
        label: "SpO₂",
        data: [98, 97, 96, 94, 90, 84],
        borderColor: "white",
        borderWidth: 3,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
        min: 80,
        max: 100,
      },
    },
  };

  return (
    <div className="app">
      <h1>ICU Remote Monitoring</h1>

      <div className="header">
        <h3>Patient: Demo Patient</h3>
        <p>Bed: ICU-03</p>
        <p>Status: Critical 🔴</p>
      </div>

      <div className="alert-banner">
        <h2>🚨 CRITICAL ALERT</h2>
        <p>SpO₂ below safe threshold</p>
        <p>Current Value: 84%</p>
        <p>Time: 12:30 PM</p>
      </div>

      <hr />

      <h2>Vitals</h2>

      <div className="vitals-grid">
        <div className="card critical">
          <h3>SpO₂</h3>
          <p>84%</p>
          <p>Critical</p>
        </div>

        <div className="card green">
          <h3>HR</h3>
          <p>75 bpm</p>
          <p>Normal</p>
        </div>

        <div className="card green">
          <h3>RR</h3>
          <p>18 bpm</p>
          <p>Normal</p>
        </div>

        <div className="card green">
          <h3>FiO₂</h3>
          <p>40%</p>
          <p>Normal</p>
        </div>

        <div className="card green">
          <h3>PEEP</h3>
          <p>5 cmH₂O</p>
          <p>Normal</p>
        </div>

        <div className="card green">
          <h3>Tidal Volume</h3>
          <p>500 mL</p>
          <p>Normal</p>
        </div>
      </div>

      <div className="section">
        <h2>📈 Vital Trends</h2>

        <div className="chart-container">
          <Line data={spo2Data} options={chartOptions} />
        </div>
      </div>

      <div className="section">
        <h2>🚨 Active Alerts</h2>

        <p>• SpO₂ dropped below threshold (84%)</p>
        <p>• Alert triggered at 12:30 PM</p>
        <p>• Clinical attention required</p>
      </div>

      <div className="section">
        <h2>💬 Doctor / Nurse Chat</h2>

        <div className="chat-container">
          <div className="doctor-msg">
            Doctor: Check airway and oxygen delivery.
          </div>

          <div className="nurse-msg">
            Nurse: Acknowledged. Assessing patient.
          </div>

          <div className="doctor-msg">
            Doctor: Update me in 5 minutes.
          </div>
        </div>
      </div>

      <div className="section">
        <h2>🤖 AI Recommendation</h2>

        <p>Patient SpO₂ has fallen below safe threshold.</p>

        <p>
          <strong>Suggested Actions:</strong>
        </p>

        <p>• Assess airway patency</p>
        <p>• Verify oxygen delivery</p>
        <p>• Check patient positioning</p>
        <p>• Continue close monitoring</p>
      </div>
    </div>
  );
}

export default App;