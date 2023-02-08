const mongoose = require("mongoose");

const listSchema = new mongoose.Schema(
  {
    title: { type: String, maxlength: 30, required: true },
    description: { type: String, required: true },
    status: { type: Boolean, required: true },
  },
  { timestamps: true }
);

const listModel = mongoose.model("todolist", listSchema);

module.exports = listModel;
