const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },

  attendance_date: {
    type: Date,
    required: true,
  },

  status: {
    type: String,
    enum: ["Present", "Absent"],
    required: true,
  },
});

module.exports = mongoose.model("Attendance", attendanceSchema);