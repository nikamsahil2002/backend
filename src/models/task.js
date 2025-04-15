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
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "project",
      required: true
    },
    media: {
      type: String,
    },
    priority: {
        type: String,
        enum: ["High", "Medium", "Low"],
        required: true
    },
    assignedTo: [{
        type: Schema.Types.ObjectId,
        ref: "user"
    }],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user"
    },
    recurrence: {
        type: String,
        enum: ["once", "daily", "weekly", "monthly"],
        default: "once"
    },
    startDate: {
      type: Date, 
    },
    estimatedTime: {
      type: Number  // in hours
    },
    completedAt: {
        type: Date,
        default: null
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