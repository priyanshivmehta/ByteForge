const express=require("express");
const router=express.Router({mergeParams:true});
const methodOverride = require("method-override");
const Mechanic = require("../model/mechanic");
const passport = require("passport");
const mechanicController=require("../controller/mechanic");
const {reviewSchema}=require("../schema.js");



const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new MongoExpiredSessionError(400,errMsg);

    }else{
        next();
    }
};



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


router.post("/:id/reviews",validateReview,mechanicController.reviews);

router.delete("/:id/reviews/:reviewId",mechanicController.deleteReview);

module.exports=router;