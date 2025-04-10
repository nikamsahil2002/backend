const mongoose = require("mongoose");
const { Schema } = mongoose;

const projectSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "category",
      required: true
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "team",
      required: true
    },
    status: {
      type: String,
      enum: ["Not Started", "In Progress", "Completed"],
      default: "Not Started",
    },
    estimatedTime: {
      type: Number,  // in hours
      required: true
    },
    startDate: {
      type: Date,
      required: false
    },
    dueDate: {
      type: Date,
      required: true
    },
    completedAt: {
        type: Date,
        default: null
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

module.exports = mongoose.model("project", projectSchema);