const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        avatar: {
            type: String,
            required: true
        },
        roleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'role',
            required: true
        },
        status: {
            type: String,
            enum: ["Active", "Inactive", "Archive"],
            default: "Active"
        },
        deletedAt: {
            type: Date,
            default: null
        },
    },
    {
        timestamps: true
    }
)

userSchema.index(
  { email: 1 },
  { unique: true, partialFilterExpression: { deletedAt: null } }
);

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.pre("findOneAndUpdate", async function (next) {
  const user = this;
  if (user._update.password) {
    try {
      const salt = await bcrypt.genSalt(10);
      user._update.password = await bcrypt.hash(user._update.password, salt);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

userSchema.pre(/^find|^count/i, function (next) {
  this.where({ deletedAt: null });
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};


module.exports = mongoose.model("user", userSchema)