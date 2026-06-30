import { useEffect, useState } from "react";
import axios from "axios";

function Batches() {
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    loadBatches();
  }, []);

  const loadBatches = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/batches"
      );

      setBatches(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  const createBatch = async () => {

    const batch_name = prompt("Batch Name");

    if (!batch_name) return;

    const start_time = prompt("Start Time");

    if (!start_time) return;

    const end_time = prompt("End Time");

    if (!end_time) return;

    try {

      await axios.post(
        "http://localhost:5000/batches",
        {
          batch_name,
          start_time,
          end_time,
        }
      );

      alert("Batch Created");

      loadBatches();

    }

    catch (err) {

      console.log(err);

    }

  };

  const editBatch = async (batch) => {

    const batch_name = prompt(
      "Batch Name",
      batch.batch_name
    );

    if (!batch_name) return;

    const start_time = prompt(
      "Start Time",
      batch.start_time
    );

    if (!start_time) return;

    const end_time = prompt(
      "End Time",
      batch.end_time
    );

    if (!end_time) return;

    try {

      await axios.put(
        `http://localhost:5000/batches/${batch._id}`,
        {
          batch_name,
          start_time,
          end_time,
        }
      );

      alert("Batch Updated");

      loadBatches();

    }

    catch (err) {

      console.log(err);

    }

  };

  const deleteBatch = async (id) => {

    if (!window.confirm("Delete Batch?"))
      return;

    try {

      const res = await axios.delete(
        `http://localhost:5000/batches/${id}`
      );

      alert(res.data.message);

      loadBatches();

    }

    catch (err) {

      alert(
        err.response?.data?.message ||
          "Cannot Delete Batch"
      );

    }

  };

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "auto",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#482728",
          fontSize: "55px",
        }}
      >
        Batch Manager
      </h1>

      <button
        onClick={createBatch}
        style={{
          background: "#482728",
          color: "white",
          border: "none",
          padding: "12px 20px",
          borderRadius: "10px",
          cursor: "pointer",
          marginBottom: "30px",
        }}
      >
        + Create Batch
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(300px,1fr))",
          gap: "20px",
        }}
      >
        {batches.map((batch) => (

          <div
            key={batch._id}
            style={{
              background: "#C0F8D1",
              borderRadius: "15px",
              padding: "20px",
            }}
          >
            <h2
              style={{
                color: "#482728",
              }}
            >
              {batch.batch_name}
            </h2>

            <p>
              {batch.start_time} - {batch.end_time}
            </p>

            <button
              onClick={() =>
                editBatch(batch)
              }
              style={{
                marginRight: "10px",
                background: "#7E4E60",
                color: "white",
                border: "none",
                padding: "8px 15px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Edit
            </button>

            <button
              onClick={() =>
                deleteBatch(batch._id)
              }
              style={{
                background: "#d62828",
                color: "white",
                border: "none",
                padding: "8px 15px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>

          </div>

        ))}
      </div>
    </div>
  );
}

export default Batches;