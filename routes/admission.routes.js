module.exports = app => {

    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    const admission = require("../controllers/admission.student.controller");

    var router = require("express").Router();
    const authJwt = require("../middlewares/authJwt");


    router.post("/admission", admission.admissionCreate);
    router.get("/admission", admission.findAll);
    // router.get("/admission", [authJwt.verifyToken, authJwt.isAdmin, authJwt.isFaculty], admission.findAll);
    router.delete("/admission/:id", admission.delete);
    router.delete("/admission", admission.deleteAll);
    router.put("/admission/:id", admission.update);

    router.post("/signin", admission.signin);


    app.use('/api', router);

}
