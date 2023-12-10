const db = require("../models");
const config = require("../config/auth.config");
var bcrypt = require("bcryptjs");
const User = db.user;
const Role = db.role;
const student = db.student;
var jwt = require("jsonwebtoken");

exports.admissionCreate = (req, res) => {
  debugger;
  const user = new User({
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  const Student = new student({
    name: req.body.name,
    batch: req.body.batch,
    medium: req.body.medium,
    course: req.body.course,
    startD: req.body.startD,
    endD: req.body.endD,
    takenby: req.body.takenby,
    rollNO: req.body.rollNO,
    invoice: req.body.invoice,
    admission: req.body.admission,
    academicYear: req.body.academicYear,
    inquiryId: db.inquiry.id,
    userId: user.id,
  });

  user.save(user).then((y) => {
    if (req.body.roles) {
      Role.find({ name: { $in: req.body.roles } }).then((roles) => {
        user.roles = roles.map((role) => role._id);
        user.save(user).then((err) => {
          Student.save(Student).then(() => {
            res.send({ message: "Student was registered successfully!" });
          });
          // res.send({ message: "student was registered successfully!" });
        });
      });
    } else {
      Role.findOne({ name: "user" }).then((role) => {
        console.log(role);
        user.roles = [role._id];
        user.save().then((err) => {
          Student.save(Student)
            .then(() => {
              res.send({ message: "Student was registered successfully!" });
            })
            .catch((e) => {
              res.send({ message: e });
            });
          // res.send({ message: "User was registered successfully!" });
        });
      });
    }
  });
};

exports.signin = (req, res) => {
  User.findOne({
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
        password: user.password,
        roles: authorities,
        accessToken: token,
      });
    });
};

exports.create = (req, res) => {
  if (!req.body.name) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  const Student = new student({
    name: req.body.name,
    batch: req.body.batch,
    medium: req.body.medium,
    course: req.body.course,
    startD: req.body.startD,
    endD: req.body.endD,
    takenby: req.body.takenby,
    rollNO: req.body.rollNO,
    invoice: req.body.invoice,
    admission: req.body.admission,
    academicYear: req.body.academicYear,
  });

  Student.save(Student)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the student.",
      });
    });
};

exports.findAll = (req, res) => {
  student
    .find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving student.",
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  student
    .findByIdAndRemove(id)
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
  student
    .deleteMany({})
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

  student
    .findByIdAndUpdate(id, req.body, { useFindAndModify: true })
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
