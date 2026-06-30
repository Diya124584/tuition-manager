const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  student_name: {
    type: String,
    required: true,
  },

  batch: {
    type: String,
    required: true,
  },

  phone_number: {
    type: String,
    required: true,
  },

  monthly_fee: {
    type: Number,
    required: true,
  },

  joining_date: {
    type: Date,
    required: true,
  },

  active: {
    type: String,
    default: "Yes",
  },

  advance_status: {
    type: String,
    default: "No",
  },
});

module.exports = mongoose.model("Student", studentSchema);