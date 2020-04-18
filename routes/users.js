var express = require('express');
const request=require('request');
var router = express.Router();
const options=require('./api');

var f;

/* GET users listing. */
router.get('/', function(req, res, next) {
  request((options,response,body)=>{
    console.log(res);
  });
  res.json(f);
});

module.exports = router;
