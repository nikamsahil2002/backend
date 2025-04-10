const mongoose = require("mongoose");

const emailTemplateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    subject: {
      type: String,
      required: true 
    },
    body: {
      type: String,
      required: true 
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("email_template", emailTemplateSchema);
