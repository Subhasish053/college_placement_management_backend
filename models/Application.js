const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
{
    studentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Student",
        required:true
    },

    driveId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Drive",
        required:true
    },

    status:{
        type:String,
        enum:[
            "Applied",
            "Shortlisted",
            "Interview Scheduled",
            "Selected",
            "Rejected"
        ],
        default:"Applied"
    }
},
{
    timestamps:true
});

module.exports = mongoose.model(
    "Application",
    applicationSchema
);