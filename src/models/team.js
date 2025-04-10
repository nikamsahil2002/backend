const mongoose = require("mongoose");
const { Schema } = mongoose;

const teamSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    lead: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: "user",
    }],
    deletedAt: {
        type: Date,
        default: null,
    },
  },
  {
    timestamps: true,
  }
);

teamSchema.pre(/^find/, function (next) {
    this.where({ deletedAt: null });
    next();
});
  

module.exports = mongoose.model("team", teamSchema);
