const mongoose = require("mongoose");
const { Schema } = mongoose;

const categorySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        deletedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true,
    }
);

categorySchema.index({ name: 1}, { unique: true, partialFilterExpression: { deletedAt: null }});

module.exports = mongoose.model("category", categorySchema);