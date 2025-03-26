const express=require("express");
const router=express.Router({mergeParams:true});
const methodOverride = require("method-override");
const Mechanic = require("../model/mechanic");
const passport = require("passport");
const mechanicController=require("../controller/mechanic");


// Mechanic Registration
router.post("/signup", mechanicController.signup);

// Mechanic Login
router.post(
    "/login",
    passport.authenticate("mechanic-local", {
        failureRedirect: "/mechanic/login",
        failureFlash: true,
    }),
    mechanicController.login
);


// Update Mechanic Details
router.put("/:id", mechanicController.update);

// Logout Mechanic
router.get("/logout", mechanicController.logout);


router.delete("/:id", mechanicController.delete);

module.exports=router;