import { useEffect, useState } from "react";
import axios from "axios";

function Announcements() {
  const [category, setCategory] = useState("");
  const [batch, setBatch] = useState("");
  const [keywords, setKeywords] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [loading, setLoading] = useState(false);
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    loadBatches();
  }, []);

  const loadBatches = async () => {
    try {
      const res = await axios.get("${import.meta.env.VITE_API_URL}/batches");
      setBatches(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const generateAnnouncement = async () => {
    if (!category || !batch || !keywords) {
      alert("Fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "${import.meta.env.VITE_API_URL}/generate-announcement",
        {
          category,
          batch,
          keywords,
        }
      );

      setAnnouncement(res.data.announcement);
    } catch (err) {
      console.log(err);
      alert("Error generating announcement");
    }

    setLoading(false);
  };

  const copyMessage = () => {
    navigator.clipboard.writeText(announcement);
    alert("Copied!");
  };

  const sendWhatsapp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(
        announcement
      )}`
    );
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "900px",
        margin: "auto",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#482728",
          fontSize: "clamp(34px,5vw,60px)",
          marginBottom: "30px",
        }}
      >
        Announcements
      </h1>

      <div
        style={{
          background: "#C0F8D1",
          padding: "30px",
          borderRadius: "15px",
          boxShadow:
            "0 6px 15px rgba(0,0,0,0.15)",
        }}
      >
        <label>Category</label>

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
          style={inputStyle}
        >
          <option value="">
            Select Category
          </option>

          <option>Holiday</option>

          <option>Exam</option>

          <option>Fees Reminder</option>

          <option>Parents Meeting</option>

          <option>General</option>
        </select>

        <label>Batch</label>

        <select
          value={batch}
          onChange={(e) =>
            setBatch(e.target.value)
          }
          style={inputStyle}
        >
          <option value="">
            Select Batch
          </option>

          {batches.map((b) => (
            <option
              key={b._id}
              value={b.batch_name}
            >
              {b.batch_name}
            </option>
          ))}
        </select>

        <label>Keywords</label>

        <textarea
          rows="4"
          placeholder="Tomorrow heavy rain, class cancelled..."
          value={keywords}
          onChange={(e) =>
            setKeywords(e.target.value)
          }
          style={inputStyle}
        />

        <button
          onClick={generateAnnouncement}
          style={buttonStyle}
        >
          {loading
            ? "Generating..."
            : "✨ Generate using Gemini"}
        </button>

        {announcement && (
          <>
            <h3
              style={{
                marginTop: "30px",
                color: "#482728",
              }}
            >
              Generated Announcement
            </h3>

            <textarea
              rows="8"
              value={announcement}
              readOnly
              style={inputStyle}
            />

            <div
              style={{
                display: "flex",
                gap: "15px",
                flexWrap: "wrap",
                marginTop: "20px",
              }}
            >
              <button
                onClick={copyMessage}
                style={buttonStyle}
              >
                📋 Copy
              </button>

              <button
                onClick={sendWhatsapp}
                style={{
                  ...buttonStyle,
                  background: "#25D366",
                }}
              >
                💬 WhatsApp
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "8px",
  marginBottom: "20px",
  borderRadius: "8px",
  border: "2px solid #7E4E60",
  fontSize: "16px",
  boxSizing: "border-box",
};

const buttonStyle = {
  background: "#482728",
  color: "white",
  border: "none",
  padding: "12px 22px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};

export default Announcements;