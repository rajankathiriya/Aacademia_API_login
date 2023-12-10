module.exports = (app) => {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  const studentRegistration = require("../controllers/studentregistration.controller");

  var router = require("express").Router();
  const authJwt = require("../middlewares/authJwt");

  router.post("/studentregistration", studentRegistration.studentSignUp);
  router.get("/studentregistration", studentRegistration.findAll);
  // router.get("/studentregistration", [authJwt2.verifyToken, authJwt2.isAdmin, authJwt2.isFaculty], studentRegistration.findAll);
  router.delete("/studentregistration/:id", studentRegistration.delete);
  router.delete("/studentregistration", studentRegistration.deleteAll);
  router.put("/studentregistration/:id", studentRegistration.update);

  router.post("/studentSignin", studentRegistration.studentSignin);

  app.use("/api", router);
};
