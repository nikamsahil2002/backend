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

permissionSchema.pre(/^find|^count/i, function (next) {
    this.where({ deletedAt: null });
    next();
});

module.exports = mongoose.model('permission', permissionSchema)