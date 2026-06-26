import "./App.css";
import { useState } from "react";

import patients from "./data/patients";
import PatientList from "./components/PatientList";

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

  const [selectedPatient, setSelectedPatient] = useState(null);

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
        data: [
          selectedPatient?.spo2 + 2,
          selectedPatient?.spo2 + 1,
          selectedPatient?.spo2,
          selectedPatient?.spo2 - 1,
          selectedPatient?.spo2 - 2,
          alertActive ? 84 : selectedPatient?.spo2,
        ],
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

  if (!selectedPatient) {
    return (
      <PatientList
        onSelectPatient={setSelectedPatient}
      />
    );
  }

  return (
    <div className="app">
      <div className="header">
        <h1>🏥 AI ICU Remote Monitoring Dashboard</h1>
        <h2>
          {selectedPatient.name} | {selectedPatient.bed}
        </h2>

        <p>
          Status: <strong>{selectedPatient.status}</strong>
        </p>

        <button
          onClick={() => {
            setSelectedPatient(null);
            setAlertActive(false);
          }}
          style={{ marginTop: "10px" }}
        >
          ← Back to Patient List
        </button>
      </div>

      {alertActive && (
        <div className="alert-banner">
          🚨 CRITICAL ALERT — SpO₂ dropped below safe threshold!
        </div>
      )}

      <button
        onClick={simulateAlert}
        style={{
          width: "100%",
          padding: "15px",
          marginBottom: "20px",
          fontSize: "18px",
          cursor: "pointer",
        }}
      >
        🚨 Simulate Alert
      </button>

      <div className="vitals-grid">
        <div className={alertActive ? "card critical" : "card green"}>
          <h3>SpO₂</h3>

          <h1>{alertActive ? 84 : selectedPatient.spo2}%</h1>

          <div className="chart-container">
            <Line
              data={spo2Data}
              options={chartOptions}
            />
          </div>
        </div>

        <div className="card green">
          <h3>Heart Rate</h3>

          <h1>{selectedPatient.hr} bpm</h1>
        </div>

        <div className="card green">
          <h3>Respiratory Rate</h3>

          <h1>{selectedPatient.rr} bpm</h1>
        </div>

        <div className="card green">
          <h3>FiO₂</h3>

          <h1>{selectedPatient.fio2}%</h1>
        </div>

        <div className="card green">
          <h3>PEEP</h3>

          <h1>{selectedPatient.peep} cmH₂O</h1>
        </div>

        <div className="card green">
          <h3>Tidal Volume</h3>

          <h1>{selectedPatient.tidalVolume} mL</h1>
        </div>
      </div>

      <div className="section">
        <h2>🤖 AI Recommendation</h2>

        {alertActive ? (
          <p>
            Increase oxygen support immediately, inspect airway patency,
            verify ventilator tubing, assess patient clinically, and
            notify the intensivist if SpO₂ does not recover.
          </p>
        ) : (
          <p>
            Patient is currently stable. Continue routine monitoring.
          </p>
        )}
      </div>

      <div className="section">
        <h2>🚨 Alert History</h2>

        {alertHistory.map((item, index) => (
          <p key={index}>{item}</p>
        ))}
      </div>

      <div className="section">
        <h2>💬 {isDoctor ? "Doctor Console" : "Nurse Console"}</h2>

        <div className="chat-container">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={msg.role === "Doctor" ? "doctor-msg" : "nurse-msg"}
            >
              <strong>{msg.role}</strong>
              <br />
              {msg.text}
              <br />
              <small>{msg.time}</small>
            </div>
          ))}
        </div>

        {isDoctor && (
          <>
            <textarea
              rows={3}
              placeholder="Type an instruction for the nurse..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{
                width: "100%",
                marginTop: "15px",
                padding: "10px",
                fontSize: "16px",
              }}
            />

            <button
              onClick={sendMessage}
              style={{
                marginTop: "10px",
                width: "100%",
                padding: "12px",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              Send Instruction
            </button>
          </>
        )}

        {!isDoctor && (
          <p
            style={{
              marginTop: "15px",
              color: "#94a3b8",
              textAlign: "center",
            }}
          >
            Nurse view is read-only. Await doctor's instructions.
          </p>
        )}
      </div>
    </div>
  );
}

export default App;