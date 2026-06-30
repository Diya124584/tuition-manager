import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Attendance from "./pages/Attendance";
import Fees from "./pages/Fees";
import Announcements from "./pages/Annoucements";
import Batches from "./pages/Batches";

function App() {
  const [open, setOpen] = useState(false);

  return (
    <BrowserRouter>
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          background: "#BDCFB5",
        }}
      >
        <Sidebar open={open} setOpen={setOpen} />

        <div
          style={{
            flex: 1,
            width: "100%",
          }}
        >
          {/* Mobile Header */}
          <div
            style={{
              background: "#482728",
              color: "white",
              padding: "15px 20px",
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <button
              onClick={() => setOpen(true)}
              style={{
                fontSize: "28px",
                background: "none",
                border: "none",
                color: "white",
                cursor: "pointer",
              }}
            >
              ☰
            </button>

            <h2 style={{ margin: 0 }}>
              Tuition Manager
            </h2>
          </div>

          <div
            style={{
              padding: "25px",
              overflowX: "auto",
            }}
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/students" element={<Students />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/fees" element={<Fees />} />
              <Route path="/batches" element={<Batches />} />
              <Route
                path="/announcements"
                element={<Announcements />}
              />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;