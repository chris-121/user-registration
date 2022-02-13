var express = require('express');
const { redirect } = require('express/lib/response');
const async = require('hbs/lib/async');
var router = express.Router();
var helpers=require('../userHelpers/helpers');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/login',(req,res)=>{
  res.render('login-page')
})
router.get('/signup',(req,res)=>{
  res.render('SignUp-page')
})
router.post('/login',async(req,res)=>{
  let user=await helpers.login(req.body)
  if(user)
  res.render('logged');
  else{
    let loginErr=true
    res.render('login-page',{loginErr});
  }
  
})
router.post('/signup',async(req,res)=>{
  let userid=await helpers.signup(req.body);
  res.render('register',{userid});
})
router.get('/forgotpassword',async(req,res)=>{
  let submit=true
  res.render('forgotpass',{submit});
})
router.post('/forgotpassword',async(req,res)=>{
  
  let user=await helpers.sqa(req.body);
  console.log(user);
  if(user)
  res.render('forgotpass',{user});
})
router.post('/forgotpass',async(req,res)=>{
  console.log(req.body);
  let user=await helpers.sq(req.body);
  if(user)
  res.render('createpass',{user});
  else
  res.redirect('/forgotpassword')
})
router.post('/createpass',async(req,res)=>{
  console.log(req.body);
  let user=await helpers.setPass(req.body);
  res.redirect('/login')
})

module.exports = router;
