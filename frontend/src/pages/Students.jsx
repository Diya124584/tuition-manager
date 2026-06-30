import { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

function Students() {
  const [studentName, setStudentName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [studentBatch, setStudentBatch] = useState("");
  const [monthlyFee, setMonthlyFee] = useState("");
  const [joiningDate, setJoiningDate] = useState("");

  const [allStudents, setAllStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showStudentForm, setShowStudentForm] = useState(false);

  const loadAllStudents = async () => {
    try {
      const res = await axios.get(
        "${import.meta.env.VITE_API_URL}/students"
      );

      setAllStudents(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadBatches = async () => {
  try {
    const res = await axios.get(
      "${import.meta.env.VITE_API_URL}/batches"
    );

    setBatches(res.data);
  } catch (err) {
    console.log(err);
  }
};
  const addStudent = async () => {
    if (editingId) {
      try {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/students/${editingId}`,
          {
            student_name: studentName,
            batch: studentBatch,
            phone_number: phoneNumber,
            monthly_fee: monthlyFee,
          }
        );

        alert("Student Updated Successfully");

        setEditingId(null);
        setShowStudentForm(false);

        setStudentName("");
        setPhoneNumber("");
        setStudentBatch("");
        setMonthlyFee("");
        setJoiningDate("");

        loadAllStudents();
        return;
      } catch (err) {
        console.log(err);
        return;
      }
    }

    try {
      await axios.post(
        "${import.meta.env.VITE_API_URL}/students",
        {
          student_name: studentName,
          batch: studentBatch,
          phone_number: phoneNumber,
          monthly_fee: monthlyFee,
          joining_date: joiningDate,
          active: "Yes",
          advance_status: "No",
        }
      );

      alert("Student Added Successfully");

      setShowStudentForm(false);

      loadAllStudents();

      setStudentName("");
      setPhoneNumber("");
      setStudentBatch("");
      setMonthlyFee("");
      setJoiningDate("");
    } catch (err) {
      console.log(err);
      alert("Error Adding Student");
    }
  };

  const deleteStudent = async (id) => {
    if (!window.confirm("Delete this student?")) {
      return;
    }

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/students/${id}`
      );

      alert("Student Deleted Successfully");

      loadAllStudents();
    } catch (err) {
      console.log(err);
    }
  };

  const editStudent = (student) => {
    setShowStudentForm(true);

    setEditingId(student._id);

    setStudentName(student.student_name);
    setPhoneNumber(student.phone_number);
    setStudentBatch(student.batch);
    setMonthlyFee(student.monthly_fee);
  };

  useEffect(() => {
    loadAllStudents();
    loadBatches();
  }, []);

  const headerStyle = {
  backgroundColor: "#7E4E60",
  color: "white",
  padding: "15px",
  border: "1px solid #B287A3",
};

const cellStyle = {
  padding: "12px",
  border: "1px solid #B287A3",
  textAlign: "center",
  backgroundColor: "#C0F8D1",
  color: "#482728",
};

  return (
  <div
    style={{
      width: "100%",
      maxWidth: "1400px",
      margin: "0 auto",
      padding: "0 20px",
      boxSizing: "border-box",
    }}
  >

    <h1
  style={{
    color: "#482728",
    textAlign: "center",
    fontSize: "60px",
    marginBottom: "20px",
  }}
> Students</h1>

      <button
  onClick={() =>
    setShowStudentForm(!showStudentForm)
  }
  style={{
    backgroundColor: "#482728",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "10px",
    cursor: "pointer",
    display: "block",
    margin: "0 auto",
  }}
>
        {showStudentForm
          ? "Close Form"
          : "+ Add Student"}
      </button>

      <br />
      <br />

      {showStudentForm && (
        <div
          style={{
             backgroundColor: "#C0F8D1",
            padding: "25px",
            borderRadius: "12px",
            marginBottom: "25px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
}}
        >
          <input
            type="text"
            placeholder="Student Name"
            value={studentName}
            onChange={(e) =>
              setStudentName(e.target.value)
            }
          />

          <br />
          <br />

          <input
            type="text"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) =>
              setPhoneNumber(e.target.value)
            }
          />

          <br />
          <br />

          <select
  value={studentBatch}
  onChange={(e) =>
    setStudentBatch(e.target.value)
  }
>
  <option value="">
    Select Batch
  </option>

  {batches.map((batch) => (
    <option
      key={batch._id}
      value={batch.batch_name}
    >
      {batch.batch_name}
    </option>
  ))}
</select>


          <br />
          <br />

          <input
            type="number"
            placeholder="Monthly Fee"
            value={monthlyFee}
            onChange={(e) =>
              setMonthlyFee(e.target.value)
            }
          />

          <br />
          <br />

          <input
            type="date"
            value={joiningDate}
            onChange={(e) =>
              setJoiningDate(e.target.value)
            }
          />

          <br />
          <br />

          <div>
            <button onClick={addStudent}>
              {editingId
                ? "Update Student"
                : "Add Student"}
            </button>

            {editingId && (
              <button
                onClick={() => {
                  setEditingId(null);
                  setShowStudentForm(false);
                }}
                style={{
                  marginLeft: "10px",
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}

      <h2
  style={{
    color: "#482728",
    textAlign: "center",
    marginBottom: "20px",
  }}
>
  Student List
</h2>

      <table
  style={{
    width: "100%",
    backgroundColor: "#C0F8D1",
    borderCollapse: "collapse",
    color: "#482728",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  }}
>
       <thead>
  <tr>
    <th style={headerStyle}>Name</th>
    <th style={headerStyle}>Batch</th>
    <th style={headerStyle}>Phone</th>
    <th style={headerStyle}>Monthly Fee</th>
    <th style={headerStyle}>Action</th>
  </tr>
</thead>

        <tbody>
          {allStudents.map((student) => (
            <tr key={student._id}>
              <td style={cellStyle}>{student.student_name}</td>
              <td style={cellStyle}>{student.batch}</td>
              <td style={cellStyle}>{student.phone_number}</td>
              <td style={cellStyle}>{student.monthly_fee}</td>

              <td style={cellStyle}>
                <button
                  onClick={() =>
                    editStudent(student)
                  }
                  style={{
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                  }}
                >
                  <FaEdit />
                </button>

                <button
                  onClick={() =>
                    deleteStudent(student._id)
                  }
                  style={{
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    marginLeft: "10px",
                  }}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Students;