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
    recurrence: {
        type: String,
        enum: ["once", "daily", "weekly", "monthly"],
        default: "once"
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

module.exports = mongoose.model("project", projectSchema);