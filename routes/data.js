const mongoose=require("mongoose");

var Schema=mongoose.Schema;
var Post=mongoose.Schema({

    Posts:String
});

var hola=new Schema({
    Name:{
        type:String,
        require:true,
        unique:false
    },
    Email:{
        type:String,
        require:true,
        unique:true
    },
    Password:{
        type:String,
        require:true,
        unique:false

    },
    posts:[Post];
},{
        timestamp:true
});
var hola=mongoose.model("User",hola);
module.exports=hola;
