const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User", // Reference to the user collection
        required : true
    },
    toUserId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    status : {
        type : String,
        required : true,
        enum : {
            values :["ignored" ,  "interested" , "accepted", "rejected"],
            message : `{VALUE} is Invalid status`
        }
    }
    },
    {
        timestamps : true
    }
)   

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre("save", async function (next) {
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("You cannot send connection request to yourself")
    }
    next()
})
const ConnectionRequest = mongoose.model("ConnectionRequest" , connectionRequestSchema ) 
module.exports = ConnectionRequest

// ignored , intrested  ,accepted , Rejected