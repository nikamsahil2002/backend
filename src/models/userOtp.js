const mongoose = require("mongoose");

const userOtpSchema = new mongoose.Schema(
  {
    otp: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    expiryTime:{
      type:Date,
      default:null
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

module.exports = mongoose.model("user_otp", userOtpSchema);