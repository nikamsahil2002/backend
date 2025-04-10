const mongoose = require("mongoose");
const moment = require('moment')

const userOtpSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiryTime:{
      type: Date,
      default: null
    },
    isVerified:{
      type: Boolean,
      default: null
    },
    deletedAt:{
        type: Date,
        default: null
    }
  },
  {
    timestamps: true,
  }
);

userOtpSchema.pre("save", async function(next){
  const userOtp = this;
  try {
    userOtp.expiryTime = moment().add(10, "minutes");
    next();
  } catch (error) {
    next(error);
  }
});


module.exports = mongoose.model("user_otp", userOtpSchema);