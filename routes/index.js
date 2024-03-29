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
  secret:"*****",
  saveUnInitialized:false,
  resave:false,
}));
app.use(session({
  name:"OUTH",
  secret:"****",
  saveUnInitialized:false,
  resave:false,
}));
app.use(session({
  name:"Kros",
  secret:"****",
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
  if(req.session.prj){
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
}
else{
  res.redirect("/login");
}
});
app.get("/login",(req,res,next)=>{
  console.log(req.session.prj);
  res.render("login");
});
app.get("/info",(req,res,next)=>{
  console.log(req.session);
  res.render("info");
});
app.post("/Post",(req,res,next)=>{
  req.session.prj=req.body.Email;
  req.session.OUTH=req.body.pass;
  db.findOne({Email:req.session.prj})
  .then((d)=>{
    if(d){
      req.session.Kros=d.Name;
    }
    else{
      console.log("Error in getting name");
    }

  });
  if(req.session.prj){

  console.log(req.session);
  if(req.session.prj){
    res.redirect("/post");
  }
  else{
    res.send("Not authorized");
  }
}
else{
  res.redirect("/login");
}
});
app.get("/post",(req,res,next)=>{
  if(!req.session.prj){
    console.log("User Not authorized");
    res.redirect("/login");
  }
  else{
    res.render("post");
  }
});
app.post("/ano",(req,res,next)=>{
  db.findOne({Email:req.session.prj})
  .then((d)=>{
    if(!d){

      console.log("User not registered");
      res.redirect("/register");
      res.send("Unauthorized");
    }
    else{
      db.findOne({Email:req.session.prj,Password:req.session.OUTH})
      .then((d)=>{
        if(d){
          console.log(d);
          d.posts.push({
            P:req.body.Text
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
          res.send("Wrong password");
        }
      });
    }
  });
  // res.redirect("/info");
});
app.get("/follow",(req,res,next)=>{
  if(req.session.prj){

    res.render("follow");


}
else{
  res.redirect("/login");
}
});
app.get("/blog",(req,res,next)=>{
  var a=[];
  if(req.session.prj){
    db.findOne({Email:req.session.prj})
    .then((d)=>{
      if(d){
        d.posts.forEach((p,i)=>{
          a.push(p.P);
        });
        res.render("show",{arr:a});

      }
      else{
        res.redirect("User not found");
      }

    });

  }
  else{
    res.redirect("/login");
  }
});
app.get("/message",(req,res,next)=>{
  if(req.session.prj){
  res.render("message")
}
else{
  res.redirect("/login");
}
});
app.post("/message",(req,res,next)=>{
  var name;
  if(req.session.prj){
    db.findOne({Email:req.session.prj})
    .then((d)=>{
      if(d){
        name=d.Name;
      }
      else{
        console.log("Session name found");
      }
    });
    db.findOne({Name:req.body.person})
    .then((d)=>{
      if(d){
        console.log("Person found")
        d.message.push({
            N:name,
            M:req.body.msg
        });
        d.save()
        .then((d)=>{
          console.log(d);
        });
      }
      else{
        res.send("User not found");
      }
    });
  }
  else{
    res.redirect("/login");
  }
});








app.post("/follow",(req,res,next)=>{
  if(req.session.prj){
    db.findOne({Name:req.body.follower})
    .then((d)=>{
      if(d){
        d.follwers.push({
            N:req.session.prj
        });

      db.findOne({Email:req.session.Email})
      .then((d)=>{
        if(d){
          d.follwed.push({
            N:req.body.follower
          });
        }



      })
      d.save()
      .then((d)=>{
        console.log(d);
      });


        res.send("inserted in database :)");
      }
      else{
        res.send("Whom you wanna follow is not in our service");
      }
    });
  }
  else{
    res.redirect("/login");
  }
});



app.get("/logout",(req,res)=>{
  if(req.session){
    req.session.destroy();
    res.clearCookie('prj');
    res.redirect("/");
  }
});





module.exports=app;
