const mongoose = require('mongoose');

const studentRecordSchema = mongoose.Schema({
    fullname: String,
    level: String,
    size: String,
    collected: Boolean
});

const StudentRecord = mongoose.model("StudentRecord", studentRecordSchema);

module.exports = { StudentRecord };
