const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
{
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    rollNumber: {
        type: String,
        required: true,
        unique: true
    },

    branch:{
        type:String,
        required:true
    },

    currentSemester: {
        type: Number,
        required: true,
        min: 1,
        max: 8
    },

    cgpa:{
        type:Number,
        required:true,
        min:0,
        max:10
    },

    passingYear:{
        type:Number,
        required:true
    },

    skills:[
        {
            type:String
        }
    ],

    mobile:{
        type:String
    },

    resume:{
        type:String
    },
    
},
{
    timestamps:true
});

module.exports = mongoose.model("Student", studentSchema);