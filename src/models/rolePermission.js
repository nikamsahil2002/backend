const mongoose = require("mongoose")

const rolePermissionSchema = new mongoose.Schema({
    roleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "role"
    },
    permissionId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "permission"
    },
    deletedAt: {
        type: Date,
        default: null
    }
},
{
    timestamps:true
}
)
module.exports = mongoose.model("role_permission", rolePermissionSchema)