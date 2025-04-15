const mongoose = require("mongoose");
const { Schema } = mongoose;

const taskRecurrenceSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    media: {
      type: String,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "project",
    },
    taskId: {
      type: Schema.Types.ObjectId,
      ref: "task"
    },
    priority: {
        type: String,
        enum: ["High", "Medium", "Low"],
        required: true
    },
    assignedTo: [{
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    }],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user"
    },
    status: {
      type: String,
      enum: ["Not Started", "In Progress", "Completed"],
      default: "Not Started",
    },
    comments: [{
      text: {
        type: String,
        required: true
      },
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("task_recurrence", taskRecurrenceSchema);