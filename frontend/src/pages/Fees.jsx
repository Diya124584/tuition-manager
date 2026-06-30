import { useEffect, useState } from "react";
import axios from "axios";

function Fees() {
  const [feesData, setFeesData] = useState([]);

  useEffect(() => {
    loadFees();
  }, []);

  const loadFees = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/fees"
      );

      setFeesData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const markPaid = async (student) => {
    try {
      const today = new Date();

      const res = await axios.post(
        "http://localhost:5000/fees/pay",
        {
          student_id: student._id,
          amount: student.monthly_fee,
          month: today.getMonth() + 1,
          year: today.getFullYear(),
        }
      );

      alert(res.data.message);

      loadFees();
    } catch (err) {
      console.log(err);
      alert("Error marking payment");
    }
  };

  const sendWhatsapp = (student) => {
    const message = `Hello, your tuition fee of ₹${student.monthly_fee} is due. Please make the payment.`;

    window.open(
      `https://wa.me/91${student.phone_number}?text=${encodeURIComponent(
        message
      )}`
    );
  };

  const editStudent = async (student) => {
    const monthlyFee = prompt(
      "Monthly Fee",
      student.monthly_fee
    );

    const advanceStatus = prompt(
      "Advance Status (yes/no)",
      student.advance_status || "no"
    );

    try {
      await axios.put(
        `http://localhost:5000/students/${student._id}`,
        {
          monthly_fee: monthlyFee,
          advance_status: advanceStatus,
        }
      );

      alert("Updated Successfully");
      loadFees();
    } catch (err) {
      console.log(err);
      alert("Update Failed");
    }
  };

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
          textAlign: "center",
          color: "#482728",
          fontSize: "clamp(34px,5vw,60px)",
          marginBottom: "25px",
        }}
      >
        Fees
      </h1>

      <div
        style={{
          width: "100%",
          overflowX: "auto",
        }}
      >
        <table
          style={{
            width: "100%",
            minWidth: "980px",
            borderCollapse: "collapse",
            backgroundColor: "#C0F8D1",
            whiteSpace: "nowrap",
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "#7E4E60",
                color: "white",
              }}
            >
              <th style={{ width: "15%", padding: "10px" }}>Student</th>
              <th style={{ width: "10%", padding: "10px" }}>Fee</th>
              <th style={{ width: "10%", padding: "10px" }}>Advance</th>
              <th style={{ width: "13%", padding: "10px" }}>Last Payment</th>
              <th style={{ width: "13%", padding: "10px" }}>Due Date</th>
              <th style={{ width: "10%", padding: "10px" }}>Status</th>
              <th style={{ width: "8%", padding: "10px" }}>Pending</th>
              <th style={{ width: "14%", padding: "10px" }}>Actions</th>
              <th style={{ width: "7%", padding: "10px" }}>Edit</th>
            </tr>
          </thead>

          <tbody>
            {feesData.map((student) => (
              <tr
                key={student._id}
                style={{
                  textAlign: "center",
                  borderBottom: "1px solid #B287A3",
                }}
              >
                <td style={{ padding: "10px" }}>
                  {student.student_name}
                </td>

                <td style={{ padding: "10px" }}>
                  ₹{student.monthly_fee}
                </td>

                <td style={{ padding: "10px" }}>
                  {student.advance_status}
                </td>

                <td
                  style={{
                    padding: "10px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {student.payment_date
                    ? new Date(
                        student.payment_date
                      ).toLocaleDateString("en-GB")
                    : "Not Paid"}
                </td>

                <td
                  style={{
                    padding: "10px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {student.due_date}
                </td>

                <td
                  style={{
                    padding: "10px",
                    fontWeight: "bold",
                    color:
                      student.status === "Overdue"
                        ? "#d62828"
                        : "#482728",
                  }}
                >
                  {student.status}
                </td>

                <td style={{ padding: "10px" }}>
                  {student.pending_months}
                </td>

                <td style={{ padding: "10px" }}>
                  <button
                    onClick={() => markPaid(student)}
                    style={{
                      minWidth: "100px",
                      backgroundColor: "#482728",
                      color: "white",
                      border: "none",
                      padding: "7px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      marginBottom: "6px",
                    }}
                  >
                    Mark Paid
                  </button>

                  <br />

                  <button
                    onClick={() =>
                      sendWhatsapp(student)
                    }
                    style={{
                      minWidth: "100px",
                      backgroundColor: "#7E4E60",
                      color: "white",
                      border: "none",
                      padding: "7px",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    WhatsApp
                  </button>
                </td>

                <td style={{ padding: "10px" }}>
                  <button
                    onClick={() =>
                      editStudent(student)
                    }
                    style={{
                      minWidth: "70px",
                      backgroundColor: "#B287A3",
                      color: "white",
                      border: "none",
                      padding: "7px",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Fees;
