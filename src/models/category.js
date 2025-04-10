const mongoose = require("mongoose");
const { Schema } = mongoose;

const countrySchema = new Schema(
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

countrySchema.index({ name: 1}, { unique: true, partialFilterExpression: { deletedAt: null }});

const country = mongoose.model("country", countrySchema);
module.exports = country;