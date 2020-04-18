var express = require('express');
const mongoose=require("mongoose");
const bodyParser=require('body-parser');
const db=require("./data");
var app=express.Router();
const session=require('express-session');
var path=require('path');
var connect=mongoose.connect("mongodb://localhost:27017/Face",{useUnifiedTopology:true,useNewUrlParser:true});
connect.then(()=>{
  console.log("Connected to database");
});
app.use(session({
  name:"prj",
  secret:"Aezakmi@1",
  saveUnInitialized:false,
  resave:false,
}));
app.use(session({
  name:"OUTH",
  secret:"Aezakmi@1",
  saveUnInitialized:false,
  resave:false,
}));


app.get("/",(req,res,next)=>{
  if(!req.session.prj){
    console.log("User Not authorized");
    res.redirect("/login");
  }
  else{
    res.render("index");
  }

});
app.get("/register",(req,res,next)=>{
  res.render("register");
});
app.post("/login",(req,res,next)=>{
  db.findOne({Name:req.body.name})
    .then((d)=>{
      if(d!=null){
        var err=new Error("User alredy exists");
        err.status=403;
        next(err);
      }
      else{
        return db.create({
          Name:req.body.name,
          Email:req.body.email,
          Password:req.body.pass
        })
      }
    })
    .then((d)=>{
      console.log("User is registered");
    });
  res.redirect("/login");
});
app.get("/login",(req,res,next)=>{
  console.log(req.session.prj);
  res.render("login");
});
app.get("/info",(req,res,next)=>{
  res.render("info");
});
app.post("/Post",(req,res,next)=>{
  req.session.prj=req.body.Email;
  req.session.OUTH=req.body.pass;
  console.log(req.session);
  if(req.session.prj){
    res.redirect("/post");
  }
  else{
    res.send("Not authorized");
  }

});
app.get("/post",(req,res,next)=>{

  res.render("post");
});
app.post("/ano",(req,res,next)=>{
  console.log(req.session.prj);
  db.findOne({Email:req.session.prj})
  .then((d)=>{
    if(!d){

      console.log("User not registered");
      res.redirect("/register");
    }
    else{
      db.findOne({Email:req.session.prj,Password:req.session.OUTH})
      .then((d)=>{
        if(d){
          console.log(d);
          d.posts.push({
            Posts:req.body.Text
          });
          d.save()
          .then((d)=>{
            console.log(d);
          });
          res.send("ok");
        }
        else{
          console.log("Wrong password");
          res.redirect("/post");
        }
      });
    }
  });
  // res.redirect("/info");
});
app.get("/logout",(req,res)=>{
  if(req.session){
    req.session.destroy();
    res.clearCookie('prj');
    res.redirect("/");
  }
});




module.exports=app;
