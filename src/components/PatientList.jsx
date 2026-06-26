import patients from "../data/patients";

function PatientList({ onSelectPatient }) {
  return (
    <div className="patient-list-page">
      <h1>🏥 AI Critical Care Monitoring</h1>

      <h2>Select a Patient</h2>

      <div className="patient-grid">
        {patients.map((patient) => (
          <div
            key={patient.id}
            className="patient-card"
            onClick={() => onSelectPatient(patient)}
          >
            <h3>{patient.name}</h3>

            <p>
              <strong>Bed:</strong> {patient.bed}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {patient.status === "Critical"
                ? "🔴 Critical"
                : patient.status === "Warning"
                ? "🟡 Warning"
                : "🟢 Stable"}
            </p>

            <hr />

            <p>SpO₂: {patient.spo2}%</p>
            <p>HR: {patient.hr} bpm</p>
            <p>RR: {patient.rr} bpm</p>

            <button
              style={{
                marginTop: "15px",
                padding: "10px 18px",
                border: "none",
                borderRadius: "8px",
                background: "#2563eb",
                color: "white",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Open Dashboard
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PatientList;