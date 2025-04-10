const mongoose = require("mongoose");
const { Schema } = mongoose;

const taskSchema = new Schema(
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
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "project",
    },
    media: {
      type: String,
    },
    priority: {
        type: String,
        enum: ["High", "Medium", "Low"]
    },
    estimatedTime: {
        type: Number  // in hours
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    status: {
      type: String,
      enum: ["Not started", "In progress", "done"],
      default: "not started",
    },
    completedAt: {
        type: Date
    },
    dueDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const task = mongoose.model("task", taskSchema);
module.exports = task;
