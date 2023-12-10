const mongoose = require("mongoose");

const Student = mongoose.model(
    "Student",
    new mongoose.Schema({
        name: String,
        batch: String,
        medium: String,
        course: Array,
        startD: Date,
        endD: Date,
        takenby: String,
        rollNO: Number,
        invoice: Number,
        admission: Date,
        academicYear: String,
        inquiryId:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Inquiry"
        }
        ,
        userId:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }

    })
);

module.exports = Student;