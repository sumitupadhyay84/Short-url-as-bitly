// this is the static page which design for url shortner which made with the help of ejs.
const express = require("express");
const URL = require("../models/url")
const{restrictTo}=require("../middleware/auth");
const router = express.Router();

router.get("/",restrictTo(["NORMAL"]),async(req,res)=>{ // heere also use the internal middleware restrictTo..
    //if(!req.user) return res.redirect("/login");
    const allurls = await URL.find({ createdBy:req.user._id });
    return res.render("home",{
        urls:allurls,
    });
});
router.get("/signup",(req,res)=>{
    return res.render("signup");
})
router.get("/login",(req,res)=>{
    return res.render("login");
})
module.exports = router;