const mongoose = require("mongoose");

const feeSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },

  month: {
    type: Number,
    required: true,
  },

  year: {
    type: Number,
    required: true,
  },

  amount: {
    type: Number,
    required: true,
  },

  status: {
    type: String,
    default: "Paid",
  },

  payment_date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Fee", feeSchema);