const express=require(express);
var router=express.Router();
router.route("/",(req,res,next)=>{
    res.render("register");
})