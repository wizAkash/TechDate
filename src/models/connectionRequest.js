const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    toUserId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ['intrested', 'ignored', 'accepted', 'rejected'],
            message: '{VALUE} is not supported'
        }
    }
},
{
    timestamps: true
});

const ConnectionRequest = mongoose.model("ConnectionRequest",  connectionRequestSchema);

module.exports = ConnectionRequest;