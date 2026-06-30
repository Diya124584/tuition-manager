const mongoose = require("mongoose");

const BatchSchema = new mongoose.Schema({
  batch_name: {
    type: String,
    required: true,
    unique: true,
  },

  start_time: {
    type: String,
    required: true,
  },

  end_time: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Batch", BatchSchema);