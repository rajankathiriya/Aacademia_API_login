module.exports = (app) => {
  const facultyRegistration = require("../controllers/facultyregistration.controller");

  var router = require("express").Router();

  router.post("/facultyregistration", facultyRegistration.facultySignUp);
  router.get("/facultyregistration", facultyRegistration.findAll);
  router.delete("/facultyregistration/:id", facultyRegistration.delete);
  router.delete("/facultyregistration", facultyRegistration.deleteAll);
  router.put("/facultyregistration/:id", facultyRegistration.update);

  router.post("/facultysignin", facultyRegistration.facultySignin);

  app.use("/api", router);
};
