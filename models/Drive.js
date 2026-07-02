const mongoose = require("mongoose");

const driveSchema = new mongoose.Schema(
{
    companyId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Company",
        required:true
    },

    driveDate:{
        type:Date,
        required:true
    },

    venue:{
        type:String,
        required:true
    },

    lastDate:{
        type:Date,
        required:true
    },

    status:{
        type:String,
        enum:[
            "Upcoming",
            "Ongoing",
            "Completed"
        ],
        default:"Upcoming"
    }
},
{
    timestamps:true
});

module.exports = mongoose.model("Drive", driveSchema);