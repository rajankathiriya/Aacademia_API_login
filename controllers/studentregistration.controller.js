const db = require("../models");
const config = require("../config/auth.config");
var bcrypt = require("bcryptjs");
const StudentRegistration = db.studentregistration;
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
      from: '"Academia....📚" <ravisenjaliya99@gmail.com>', // sender address
      to: req.body.email,
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: `
      <div>
      <img src="https://visme.co/blog/wp-content/uploads/2020/02/header-1200.gif" alt="img" width="100%"/>
        <h3>Here are your login details:</h3>
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

    studentRegistration.save(studentRegistration).then((err) => {
      res.send({ message: "Student was registered successfully!" });
    });
  });
};

exports.studentSignin = (req, res) => {
  StudentRegistration.findOne({
    email: req.body.email,
  })
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

      res.status(200).send({
        id: user._id,
        email: user.email,
        fees: user.fees,
        dumID: user.dumID,
        gender: user.gender,
        name: user.name,
        studentmobile: user.studentmobile,
        password: user.password,
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
