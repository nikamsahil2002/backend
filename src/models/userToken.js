const mongoose = require("mongoose");

const userTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    deletedAt:{
      type:Date,
      default:null
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("user_token", userTokenSchema);
