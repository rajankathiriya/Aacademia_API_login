module.exports = (app) => {
  const studentRegistration = require("../controllers/studentregistration.controller");

  var router = require("express").Router();

  router.post("/studentregistration", studentRegistration.studentSignUp);
  router.get("/studentregistration", studentRegistration.findAll);
  router.delete("/studentregistration/:id", studentRegistration.delete);
  router.delete("/studentregistration", studentRegistration.deleteAll);
  router.put("/studentregistration/:id", studentRegistration.update);

  router.post("/studentSignin", studentRegistration.studentSignin);

  app.use("/api", router);
};
