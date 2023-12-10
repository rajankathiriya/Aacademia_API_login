const db = require("../models");
const config = require("../config/auth.config");
var bcrypt = require("bcryptjs");
const StudentRegistration = db.studentregistration;
const Role = db.role;
var jwt = require("jsonwebtoken");

exports.studentSignUp = (req, res) => {
  debugger;
  const studentRegistration = new StudentRegistration({
    name: req.body.name,
    email: req.body.email,
    dumID: req.body.dumID,
    fees: req.body.fees,
    gender: req.body.gender,
    studentmobile: req.body.studentmobile,
    password: bcrypt.hashSync(req.body.password, 8),
    roles: db.role.id,
  });

  studentRegistration.save(studentRegistration).then((y) => {
    // ======================================================= email karvamate
    var nodemailer = require("nodemailer");
    var transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.forwardemail.net",
      port: 587,
      secure: false,
      auth: {
        user: "ravisenjaliya99@gmail.com",
        pass: "abda ixyu aaqo ptwg",
      },
    });
    var mailOptions = {
      from: '"Academia.... 👻" <ravisenjaliya99@gmail.com>', // sender address
      to: req.body.email,
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: `
      <div>
        <p>Here are your login details:</p>
        <p>User ID: ${req.body.email}</p>
        <p>Password: ${req.body.password}</p>
      </div>
    `,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    // =======================================================================

    if (req.body.roles) {
      Role.find({ name: { $in: req.body.roles } }).then((roles) => {
        studentRegistration.roles = roles.map((role) => role._id);
        studentRegistration.save(studentRegistration).then((err) => {
          res.send({ message: "Faculty was registered successfully!" });
        });
      });
    } else {
      Role.findOne({ name: "admin" }).then((role) => {
        console.log(role);
        studentRegistration.save().then((err) => {
          res.send({ message: "Faculty was registered successfully!" });
        });
      });
    }
  });
};

exports.studentSignin = (req, res) => {
  StudentRegistration.findOne({
    email: req.body.email,
  })
    .populate("roles", "-__v")
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      res.status(200).send({
        id: user._id,
        email: user.email,
        fees: user.fees,
        dumID: user.dumID,
        gender: user.gender,
        name: user.name,
        studentmobile: user.studentmobile,
        password: user.password,
        roles: authorities,
        accessToken: token,
      });
    });
};

exports.findAll = (req, res) => {
  StudentRegistration.find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving student.",
      });
    });
};

exports.findById = (req, res) => {
  const id = req.params.id;

  StudentRegistration.findById(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving StudentRegistration.",
      });
    });
};
exports.delete = (req, res) => {
  const id = req.params.id;

  StudentRegistration.findByIdAndRemove(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete data with id=${id}. Maybe data was not found!`,
        });
      } else {
        res.send({
          message: "data was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete data with id=" + id,
      });
    });
};

exports.deleteAll = (req, res) => {
  StudentRegistration.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} Student data were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all data.",
      });
    });
};

exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  StudentRegistration.findByIdAndUpdate(id, req.body, {
    useFindAndModify: true,
  })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update student with id=${id}. Maybe student was not found!`,
        });
      } else res.send({ message: "Student was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating student with id=" + id,
      });
    });
};
