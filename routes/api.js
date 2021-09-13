const request=require('request');

//fc45069dea544fe18c52c4676e751f07
//http://newsapi.org/v2/top-headlines?sources=google-news&apiKey=fc45069dea544fe18c52c4676e751f07
var options={
    method:"GET",
    url:"http://newsapi.org/v2/top-headlines",
    qs:{
        sources:"google-news",
        apiKey:"**********************"
     }

};
module.exports=options;
