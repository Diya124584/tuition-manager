import { useState,useEffect } from "react";
import axios from "axios";

function Attendance() {
  const [batch, setBatch] = useState("");
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [attendanceData, setAttendanceData] = useState([]);
  const [batches, setBatches] = useState([]);

  const loadStudents = async (selectedBatch) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/students/batch/${selectedBatch}`
      );

      setStudents(res.data);

      const initialAttendance = {};

      res.data.forEach((student) => {
        initialAttendance[student._id] = "Present";
      });

      setAttendance(initialAttendance);
    } catch (err) {
      console.log(err);
    }
  };

  const loadAttendanceRegister = async (selectedBatch) => {
    if (!selectedBatch) return;

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/attendance-register/${selectedBatch}`
      );

      console.log("Attendance Register Response");
      console.log(res.data);

      setAttendanceData(res.data);
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

  const saveAttendance = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];

      for (const student of students) {
        await axios.post(
          "${import.meta.env.VITE_API_URL}/attendance",
          {
            student_id: student._id,
            attendance_date: today,
            status: attendance[student._id],
          }
        );
      }

      alert("Attendance Saved Successfully");
      loadAttendanceRegister(batch);
    } catch (err) {
      console.log(err);
      alert("Error Saving Attendance");
    }
  };

  useEffect(() => {
  loadBatches();
}, []);

  const daysInMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0
  ).getDate();

  const uniqueStudents = [
    ...new Set(
      attendanceData.map(
        (item) => item.student_name
      )
    ),
  ];

  return (
    <div
      style={{
        width: "100%",
        padding: "10px",
        boxSizing: "border-box",
      }}
    >
      <h1
        style={{
          color: "#482728",
          textAlign: "center",
          fontSize: "clamp(34px,5vw,50px)",
          marginBottom: "25px",
        }}
      >
        Attendance
      </h1>

      {/* Batch Selection */}
      <div
        style={{
          backgroundColor: "#C0F8D1",
          padding: "20px",
          borderRadius: "15px",
          marginBottom: "25px",
          textAlign: "center",
          boxShadow:
            "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2
          style={{
            color: "#482728",
          }}
        >
          Select Batch
        </h2>

        <select
          value={batch}
          onChange={(e) => {
            const selectedBatch =
              e.target.value;

            setBatch(selectedBatch);

            loadStudents(selectedBatch);
            loadAttendanceRegister(
              selectedBatch
            );
          }}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border:
              "2px solid #7E4E60",
            backgroundColor:
              "#BDCFB5",
            color: "#482728",
            fontWeight: "bold",
          }}
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
      </div>

      {/* Mark Attendance */}
      <div
        style={{
          backgroundColor: "#C0F8D1",
          padding: "20px",
          borderRadius: "15px",
          marginBottom: "25px",
          boxShadow:
            "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2
          style={{
            color: "#482728",
            textAlign: "center",
          }}
        >
          Mark Attendance
        </h2>

        {students.length === 0 ? (
          <p
            style={{
              textAlign: "center",
            }}
          >
            Select a batch first
          </p>
        ) : (
          <>
            {students.map((student) => (
              <div
                key={student._id}
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                  backgroundColor:
                    "#B287A3",
                  color: "white",
                  borderRadius: "12px",
                  padding:
                    "16px 20px",
                  marginBottom: "12px",
                  boxShadow:
                    "0 3px 8px rgba(0,0,0,0.15)",
                  flexWrap: "wrap",
                  gap: "12px"                
                
                }}
              >
                <div>
                  {
                    student.student_name
                  }
                </div>

                <select
                  value={
                    attendance[
                      student._id
                    ]
                  }
                  onChange={(e) =>
                    setAttendance({
                      ...attendance,
                      [student._id]:
                        e.target.value,
                    })
                  }

                  style={{
                     padding: "8px",
                     borderRadius: "8px",
                     minWidth: "120px",
}}
                >
                  <option value="Present">
                    Present
                  </option>

                  <option value="Absent">
                    Absent
                  </option>
                </select>
              </div>
            ))}

            <button
              onClick={
                saveAttendance
              }
              style={{
                backgroundColor:
                  "#482728",
                color: "white",
                border: "none",
                padding:"12px 18px",
                width:"100%",
                maxWidth:"260px",
                display:"block",
                margin:"20px auto 0",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Save Attendance
            </button>
          </>
        )}
      </div>

      {/* Attendance Register */}
      <div
        style={{
          backgroundColor: "#C0F8D1",
          padding: "20px",
          borderRadius: "15px",
          overflowX: "auto",
          boxShadow:
            "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2
          style={{
            color: "#482728",
            textAlign: "center",
          }}
        >
          Attendance Register
        </h2>

        <table
            style={{
             width: "100%",
            minWidth: "1000px",
            borderCollapse: "collapse",
            backgroundColor: "#BDCFB5",
            color: "#482728",
            whiteSpace: "nowrap",
  }}
>
          <thead>
            <tr>
              <th
                style={headerStyle}
              >
                Student
              </th>

              {Array.from(
                {
                  length:
                    daysInMonth,
                },
                (_, index) => (
                  <th
                    key={index}
                    style={
                      headerStyle
                    }
                  >
                    {index + 1}
                  </th>
                )
              )}

              <th
                style={headerStyle}
              >
                %
              </th>
            </tr>
          </thead>

          <tbody>
            {uniqueStudents.map(
              (student) => (
                <tr
                  key={student}
                >
                  <td
                    style={
                      cellStyle
                    }
                  >
                    {student}
                  </td>

                  {Array.from(
                    {
                      length:
                        daysInMonth,
                    },
                    (
                      _,
                      index
                    ) => {
                      const day =
                        index + 1;

                      const attendanceRecord =
                        attendanceData.find(
                          (
                            item
                          ) => {
                            const recordDate =
                              new Date(
                                item.attendance_date
                              );

                            return (
                              item.student_name ===
                                student &&
                              recordDate.getDate() ===
                                day
                            );
                          }
                        );

                      return (
                        <td
                          key={day}
                          style={
                            cellStyle
                          }
                        >
                          {attendanceRecord
                            ? attendanceRecord.status ===
                              "Present"
                              ? "P"
                              : "A"
                            : "-"}
                        </td>
                      );
                    }
                  )}

                  <td
                    style={
                      cellStyle
                    }
                  >
                    {(() => {
                      const studentRecords =
                        attendanceData.filter(
                          (
                            item
                          ) =>
                            item.student_name ===
                            student
                        );

                      const presentCount =
                        studentRecords.filter(
                          (
                            item
                          ) =>
                            item.status ===
                            "Present"
                        ).length;

                      const totalCount =
                        studentRecords.length;

                      if (
                        totalCount ===
                        0
                      )
                        return "0%";

                      return (
                        Math.round(
                          (presentCount /
                            totalCount) *
                            100
                        ) + "%"
                      );
                    })()}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const headerStyle = {
  backgroundColor: "#7E4E60",
  color: "white",
  padding: "10px",
  border: "1px solid #B287A3",
  whiteSpace: "nowrap",
};


const cellStyle = {
  padding: "8px",
  border: "1px solid #B287A3",
  textAlign: "center",
  whiteSpace: "nowrap",
};

export default Attendance;