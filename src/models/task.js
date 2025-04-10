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
        ref: "user",
        required: true
    }],
    recurrence: {
        type: String,
        enum: ["once", "daily", "weekly", "monthly"],
        default: "once"
    },
    estimatedTime: {
      type: Number,  // in hours
      required: false
    },
    startDate: {
      type: Date,
      required: false
    },
    dueDate: {
      type: Date,
      required: false
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

module.exports = mongoose.model("task", taskSchema);
