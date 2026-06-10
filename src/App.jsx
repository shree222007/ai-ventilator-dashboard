import "./App.css";
import { useState } from "react";

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
  const role =
    new URLSearchParams(window.location.search).get("role") || "doctor";

  const isDoctor = role === "doctor";

  const [alertActive, setAlertActive] = useState(false);

  const [alertHistory, setAlertHistory] = useState([
    "12:10 PM - PEEP warning detected",
    "12:15 PM - HR elevated above safe range",
    "12:20 PM - FiO₂ warning detected",
    "12:25 PM - RR exceeded threshold",
  ]);

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      role: "Doctor",
      text: "Check airway and oxygen delivery.",
      time: "12:25 PM",
    },
    {
      role: "Nurse",
      text: "Acknowledged. Assessing patient.",
      time: "12:26 PM",
    },
    {
      role: "Doctor",
      text: "Update me in 5 minutes.",
      time: "12:27 PM",
    },
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newMessage = {
      role: "Doctor",
      text: message,
      time: currentTime,
    };

    setMessages([newMessage, ...messages]);
    setMessage("");
  };

  const simulateAlert = () => {
    setAlertActive(true);

    const currentAlert = "12:30 PM - SpO₂ dropped to 84%";

    setAlertHistory((prev) => [
      currentAlert,
      ...prev.slice(0, 4),
    ]);

    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification("🚨 ICU Alert", {
            body: "SpO₂ dropped below safe threshold (84%)",
          });
        }
      });
    }

    const audio = new Audio(
      "https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"
    );

    audio.play();
  };

  const spo2Data = {
    labels: ["10s", "8s", "6s", "4s", "2s", "Now"],
    datasets: [
      {
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

      <button
        onClick={simulateAlert}
        style={{
          padding: "12px 20px",
          background: "#dc2626",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
          marginBottom: "20px",
        }}
      >
        🚨 Simulate Alert
      </button>

      <div className="header">
        <h3>Patient: Demo Patient</h3>
        <p>Bed: ICU-03</p>
        <p>Status: {alertActive ? "Critical 🔴" : "Stable 🟢"}</p>
        <p>
          Current Role:
          <strong>
            {" "}
            {isDoctor ? "Doctor 👨‍⚕️" : "Nurse 👩‍⚕️"}
          </strong>
        </p>
      </div>

      {alertActive && (
        <div className="alert-banner">
          <h2>🚨 CRITICAL ALERT</h2>
          <p>SpO₂ below safe threshold</p>
          <p>Current Value: 84%</p>
          <p>Time: 12:30 PM</p>
        </div>
      )}

      <hr />

      <h2>Vitals</h2>

      <div className="vitals-grid">
        <div className={`card ${alertActive ? "critical" : "green"}`}>
          <h3>SpO₂</h3>
          <p>{alertActive ? "84%" : "98%"}</p>
          <p>{alertActive ? "Critical" : "Normal"}</p>
        </div>

        <div className="card green">
          <h3>HR</h3>
          <p>75 bpm</p>
        </div>

        <div className="card green">
          <h3>RR</h3>
          <p>18 bpm</p>
        </div>

        <div className="card green">
          <h3>FiO₂</h3>
          <p>40%</p>
        </div>

        <div className="card green">
          <h3>PEEP</h3>
          <p>5 cmH₂O</p>
        </div>

        <div className="card green">
          <h3>Tidal Volume</h3>
          <p>500 mL</p>
        </div>
      </div>

      <div className="section">
        <h2>📈 Vital Trends</h2>

        <div className="chart-container">
          <Line data={spo2Data} options={chartOptions} />
        </div>
      </div>

      <div className="section">
        <h2>🚨 Alert History</h2>

        {alertHistory.map((alert, index) => (
          <p key={index}>• {alert}</p>
        ))}
      </div>

      <div className="section">
        <h2>💬 Doctor / Nurse Chat</h2>

        {isDoctor && (
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            <input
              type="text"
              placeholder="Type instruction..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "8px",
              }}
            />

            <button
              onClick={sendMessage}
              style={{
                padding: "12px 20px",
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </div>
        )}

        <div className="chat-container">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={
                msg.role === "Doctor"
                  ? "doctor-msg"
                  : "nurse-msg"
              }
            >
              <strong>{msg.role}</strong>
              <br />
              {msg.text}
              <br />
              <small>{msg.time}</small>
            </div>
          ))}
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

        <p>
          <strong>
            ⚠️ AI Suggestion Only – Verify with attending physician.
          </strong>
        </p>
      </div>
    </div>
  );
}

export default App;