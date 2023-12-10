module.exports = (app) => {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  const facultyRegistration = require("../controllers/facultyregistration.controller");

  var router = require("express").Router();
  const authJwt = require("../middlewares/authJwt");

  router.post("/facultyregistration", facultyRegistration.facultySignUp);
  router.get("/facultyregistration", facultyRegistration.findAll);
  // router.get("/facultyregistration", [authJwt2.verifyToken, authJwt2.isAdmin, authJwt2.isFaculty], facultyRegistration.findAll);
  router.delete("/facultyregistration/:id", facultyRegistration.delete);
  router.delete("/facultyregistration", facultyRegistration.deleteAll);
  router.put("/facultyregistration/:id", facultyRegistration.update);

  router.post("/facultysignin", facultyRegistration.facultySignin);

  app.use("/api", router);
};
