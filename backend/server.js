require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const Student = require("./models/Student");
const Batch = require("./models/Batch");
const Attendance = require("./models/Attendance");
const Fee = require("./models/Fees");

const express = require("express");
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
require("./db/mongodb");
//const db = require("./db/db");
const cors = require("cors");

const app = express();

app.get("/hello", (req, res) => {
    res.send("HELLO WORKING");
});

app.get("/test-students-route", (req, res) => {
    res.send("students route file loaded");
});

app.use(cors());
app.use(express.json());


// ================= HOME =================

app.get("/", (req, res) => {
    res.send("Tuition Management Backend Running 🚀");
});


// ================= STUDENTS ===============
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.get("/student/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Student Not Found",
      });
    }

    res.json(student);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.get("/students-simple", async (req, res) => {
  try {
    const students = await Student.find(
      {},
      {
        student_name: 1,
      }
    );

    res.json(students);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.get("/students/batch/:batch", async (req, res) => {
  try {
    const students = await Student.find({
      batch: req.params.batch,
    });

    res.json(students);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.post("/students", async (req, res) => {
  try {
    const student = await Student.create({
      student_name: req.body.student_name,
      batch: req.body.batch,
      phone_number: req.body.phone_number,
      monthly_fee: req.body.monthly_fee,
      joining_date: req.body.joining_date,
      active: req.body.active,
      advance_status: req.body.advance_status,
    });

    res.json({
      message: "Student Added Successfully",
      id: student._id,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

app.delete("/students/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);

    res.json({
      message: "Student Deleted Successfully",
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

app.put("/students/:id", async (req, res) => {
  try {
    await Student.findByIdAndUpdate(
      req.params.id,
      {
        student_name: req.body.student_name,
        batch: req.body.batch,
        phone_number: req.body.phone_number,
        monthly_fee: req.body.monthly_fee,
        advance_status: req.body.advance_status,
      },
      {
        new: true,
      }
    );

    res.json({
      message: "Student Updated Successfully",
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// ================= BATCHES =================

// Get All Batches
app.get("/batches", async (req, res) => {
  try {
    const batches = await Batch.find().sort({
      batch_name: 1,
    });

    res.json(batches);
  } catch (err) {
    res.status(500).json(err);
  }
});


// Add Batch
app.post("/batches", async (req, res) => {
  try {

    const batch = await Batch.create({
      batch_name: req.body.batch_name,
      start_time: req.body.start_time,
      end_time: req.body.end_time,
    });

    res.json({
      message: "Batch Created Successfully",
      id: batch._id,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json(err);

  }
});


// Edit Batch
app.put("/batches/:id", async (req, res) => {

  try {

    await Batch.findByIdAndUpdate(

      req.params.id,

      {
        batch_name: req.body.batch_name,
        start_time: req.body.start_time,
        end_time: req.body.end_time,
      },

      {
        new: true,
      }

    );

    res.json({
      message: "Batch Updated Successfully",
    });

  }

  catch (err) {

    console.log(err);

    res.status(500).json(err);

  }

});


// Delete Batch
app.delete("/batches/:id", async (req, res) => {

  try {

    const studentCount =
      await Student.countDocuments({
        batch: req.params.id,
      });

    if (studentCount > 0) {

      return res.status(400).json({
        message:
          "Batch contains students. Remove them first.",
      });

    }

    await Batch.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Batch Deleted Successfully",
    });

  }

  catch (err) {

    console.log(err);

    res.status(500).json(err);

  }

});

// ================= ANNOUNCEMENTS =================
app.post("/generate-announcement", async (req, res) => {
  try {
    const { category, batch, keywords } = req.body;

    const prompt = `
You are an experienced tuition teacher.

Write a professional WhatsApp announcement.

Category: ${category}

Batch: ${batch}

Keywords: ${keywords}

Rules:
- Friendly
- Professional
- Under 120 words
- No emojis
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    console.log(result);

    res.json({
      announcement: result.text,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
});
// ================= ATTENDANCE =================

// Get all attendance
app.get("/attendance", async (req, res) => {
  try {
    const attendance = await Attendance.find().populate(
      "student_id",
      "student_name batch"
    );

    res.json(attendance);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Add / Update Attendance
app.post("/attendance", async (req, res) => {
  try {
    const { student_id, attendance_date, status } = req.body;

    const existingAttendance = await Attendance.findOne({
      student_id,
      attendance_date,
    });

    if (existingAttendance) {
      existingAttendance.status = status;
      await existingAttendance.save();

      return res.json({
        message: "Attendance Updated Successfully",
      });
    }

    const attendance = await Attendance.create({
      student_id,
      attendance_date,
      status,
    });

    res.json({
      message: "Attendance Added Successfully",
      id: attendance._id,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Attendance Details
app.get("/attendance-details", async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate("student_id", "student_name")
      .sort({ attendance_date: -1 });

    const result = attendance.map((item) => ({
      _id: item._id,
      student_name: item.student_id?.student_name,
      attendance_date: item.attendance_date,
      status: item.status,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Attendance Register
app.get("/attendance-register", async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate("student_id", "student_name")
      .sort({ attendance_date: 1 });

    const result = attendance.map((item) => ({
      student_name: item.student_id?.student_name,
      attendance_date: item.attendance_date,
      status: item.status,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Attendance Register By Batch
app.get("/attendance-register/:batch", async (req, res) => {
  try {
    const attendance = await Attendance.find().populate("student_id");

    const result = attendance
      .filter(
        (item) =>
          item.student_id &&
          item.student_id.batch === req.params.batch
      )
      .map((item) => ({
        student_name: item.student_id.student_name,
        batch: item.student_id.batch,
        attendance_date: item.attendance_date,
        status: item.status,
      }));

    res.json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});


// ================= FEES =================

app.get("/fees", async (req, res) => {
  try {
    const students = await Student.find();

    const fees = await Fee.find().sort({
      payment_date: -1,
    });

    const today = new Date();

    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    const result = [];

    for (const student of students) {

      const studentFees = fees.filter(
        (fee) =>
          fee.student_id.toString() ===
          student._id.toString()
      );

      const lastPayment =
        studentFees.length > 0
          ? studentFees[0]
          : null;

      let dueDate;

      const joinDate = new Date(
        student.joining_date
      );

      const joinDay =
        joinDate.getDate();

      const isAdvance =
        student.advance_status?.toLowerCase() ===
        "yes";

      // ------------------------
      // CURRENT MONTH PAID?
      // ------------------------

      const currentPaid =
        studentFees.find(
          (fee) =>
            fee.month === currentMonth &&
            fee.year === currentYear
        );

      // ------------------------
      // FIRST PAYMENT
      // ------------------------

      if (studentFees.length === 0) {

        if (isAdvance) {

          dueDate = new Date(
            joinDate.getFullYear(),
            joinDate.getMonth() + 1,
            1
          );

        } else {

          dueDate = new Date(
            joinDate.getFullYear(),
            joinDate.getMonth() + 1,
            joinDay
          );

        }

      }

      // ------------------------
      // AFTER FIRST PAYMENT
      // ------------------------

      else {

        dueDate = new Date(
          currentYear,
          currentMonth - 1,
          joinDay
        );

      }

      const graceDate = new Date(
        dueDate
      );

      graceDate.setDate(
        graceDate.getDate() + 5
      );

      let status = "Pending";

      if (currentPaid) {

        status = "Paid";

      }

      else if (
        today > graceDate
      ) {

        status = "Overdue";

      }

      let pendingMonths = 0;

      if (!currentPaid) {

        pendingMonths =
          (currentYear -
            dueDate.getFullYear()) *
            12 +
          (currentMonth -
            (dueDate.getMonth() + 1));

        if (today > graceDate) {

          pendingMonths++;

        }

        if (
          pendingMonths < 0
        ) {

          pendingMonths = 0;

        }

      }

      result.push({

        _id: student._id,

        student_name:
          student.student_name,

        phone_number:
          student.phone_number,

        monthly_fee:
          student.monthly_fee,

        joining_date:
          student.joining_date,

        advance_status:
          student.advance_status,

        payment_date:
          lastPayment
            ? lastPayment.payment_date
            : null,

        due_date:
          dueDate.toLocaleDateString(
            "en-GB"
          ),

        status,

        pending_months:
          pendingMonths,

      });

    }

    res.json(result);

  }

  catch (err) {

    console.log(err);

    res.status(500).json(err);

  }

});

// Mark Fee Paid
app.post("/fees/pay", async (req, res) => {
  try {
    console.log(req.body);

    const {
      student_id,
      amount,
      month,
      year,
    } = req.body;

    const existing = await Fee.findOne({
  student_id,
  month,
  year,
});

if (existing) {
  return res.json({
    message: "Already Paid",
  });
}

    await Fee.create({
      student_id,
      amount,
      month,
      year,
      status: "Paid",
      payment_date: new Date(),
    });

    res.json({
      message: "Fee marked as paid",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// ================= SERVER =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});