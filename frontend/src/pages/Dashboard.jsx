import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [students, setStudents] = useState([]);
  const [feesData, setFeesData] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const studentsRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/students`
      );

      const feesRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/fees`
      );

      setStudents(studentsRes.data);
      setFeesData(feesRes.data);
    } catch (err) {
      console.log(err);
    }
  };

  const totalStudents = students.length;

  const totalCollection = feesData
    .filter((fee) => fee.status === "Paid")
    .reduce(
      (sum, fee) => sum + Number(fee.monthly_fee || 0),
      0
    );

  const advanceStudents = students.filter(
    (student) =>
      student.advance_status?.toLowerCase() === "yes"
  ).length;

  const regularStudents =
    totalStudents - advanceStudents;

  const overdueStudents = feesData.filter(
    (fee) => fee.status === "Overdue"
  ).length;

  const pendingStudents = feesData.filter(
    (fee) => fee.status !== "Paid"
  ).length;

  return (
    <div
  style={{
    width: "100%",
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "10px",
    boxSizing: "border-box",
  }}
>
      <h1
        style={{
          textAlign: "center",
          color: "#482728",
          fontSize: "clamp(34px,5vw,60px)",
          marginBottom: "35px",
        }}
      >
        Dashboard
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(260px,1fr))",
          gap: "20px",
        }}
      >
        <Card
          title="👨‍🎓 Total Students"
          value={totalStudents}
          bg="#C0F8D1"
          color="#482728"
        />

        <Card
          title="💰 Monthly Collection"
          value={`₹${totalCollection}`}
          bg="#BDCFB5"
          color="#482728"
        />

        <Card
          title="⏳ Pending Fees"
          value={pendingStudents}
          bg="#B287A3"
          color="white"
        />

        <Card
          title="🚨 Overdue Students"
          value={overdueStudents}
          bg="#7E4E60"
          color="white"
        />

        <Card
          title="💵 Advance Students"
          value={advanceStudents}
          bg="#C0F8D1"
          color="#482728"
        />

        <Card
          title="📚 Regular Students"
          value={regularStudents}
          bg="#BDCFB5"
          color="#482728"
        />
      </div>

      <div
        style={{
          marginTop: "35px",
          background: "#C0F8D1",
          borderRadius: "15px",
          padding: "20px",
        }}
      >
        <h2
          style={{
            color: "#482728",
            marginBottom: "15px",
          }}
        >
          Recent Students
        </h2>

        <div
  style={{
    overflowX: "auto",
  }}
>
  <table
    style={{
      width: "100%",
      minWidth: "650px",
      borderCollapse: "collapse",
      whiteSpace: "nowrap",
    }}
  >
        
          <thead>
            <tr
              style={{
                background: "#7E4E60",
                color: "white",
              }}
            >
              <th style={{ padding: "12px" }}>
                Name
              </th>

              <th style={{ padding: "12px" }}>
                Batch
              </th>

              <th style={{ padding: "12px" }}>
                Fee
              </th>

              <th style={{ padding: "12px" }}>
                Advance
              </th>
            </tr>
          </thead>

          <tbody>
            {students
              .slice(-5)
              .reverse()
              .map((student) => (
                <tr
                  key={student._id}
                  style={{
                    textAlign: "center",
                    borderBottom:
                      "1px solid #B287A3",
                  }}
                >
                  <td style={{ padding: "12px" }}>
                    {student.student_name}
                  </td>

                  <td style={{ padding: "12px" }}>
                    {student.batch}
                  </td>

                  <td style={{ padding: "12px" }}>
                    ₹{student.monthly_fee}
                  </td>

                  <td style={{ padding: "12px" }}>
                    {student.advance_status}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}

function Card({
  title,
  value,
  bg,
  color,
}) {
  return (
    <div
      style={{
        background: bg,
        borderRadius: "18px",
        textAlign: "center",
        boxShadow:
          "0 8px 20px rgba(0,0,0,0.12)",
        padding: "22px",
        minHeight: "170px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
       <h3
  style={{
    color,
    marginBottom: "20px",
    fontSize: "18px",
  }}
>
        {title}
      </h3>

      <h1
        style={{
          color,
          fontSize: "clamp(30px,4vw,42px)",
          margin: 0,
        }}
      >
        {value}
      </h1>
    </div>
  );
}

export default Dashboard;