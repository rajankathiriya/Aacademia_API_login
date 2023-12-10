const dbConfig = require("../config/db.config");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;

db.facultyregistration = require("./facultyregistration.model")(mongoose);
db.studentregistration = require("./studentregistration.model")(mongoose);

db.student = require("./admission.student.model");
db.role = require("./role.model");
db.user = require("./user.model")(mongoose);
db.ROLES = ["user", "admin", "faculty"];

module.exports = db;
