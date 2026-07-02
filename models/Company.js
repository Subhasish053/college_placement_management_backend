const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
{
    companyName:{
        type:String,
        required:true
    },

    role:{
        type:String,
        required:true
    },

    package:{
        type:Number,
        required:true,
        min:1
    },

    minCGPA:{
        type:Number,
        required:true,
        min: 0,
        max: 10
    },

    eligibleSemester: {
        type: Number,
        default: 5,
        min: 1,
        max: 8
    },

    location:{
        type:String,
        required:true
    },

    description:{
        type:String
    }
},
{
    timestamps:true
});

module.exports = mongoose.model("Company", companySchema);