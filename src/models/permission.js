const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema({
        action: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        method: {
            type: String,
            required: true
        },
        baseUrl: {
            type: String,
            required: true
        },
        path: {
            type: String,
            required: true
        },
        deletedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('permission', permissionSchema)