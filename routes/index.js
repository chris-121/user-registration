var express = require('express');
const { redirect, clearCookie } = require('express/lib/response');
const async = require('hbs/lib/async');
const { token } = require('morgan');
var router = express.Router();
var helpers=require('../userHelpers/helpers');
var jwt=require('jsonwebtoken');
/* GET home page. */
function verifyToken(req,res,next){
  let token=req.cookies.token;
  if(typeof token !== 'undefined')
  {
    const user=jwt.verify(token,"secretkey")
    req.user=user;
    next()
  }else
  next()
}
router.get('/', verifyToken,async(req, res, next)=> {
  if(req.user){
    let user=req.user.user;
    let posts=await helpers.getData()
    let comments=posts.comment;
    res.render('logged',{user,posts,comments});
  }else
  res.render('index');
});

router.get('/login',verifyToken,async(req,res)=>{
  if(req.user){
    let user=req.user.user;
    console.log(user);
    let posts=await helpers.getData()
    let comments=posts.comment;
    res.render('logged',{user,posts,comments});
  }else
  res.render('login-page')
})
router.get('/signup',(req,res)=>{
  res.render('SignUp-page')
})
router.post('/login',async(req,res)=>{
  let user=await helpers.login(req.body)
  let tokens;
  jwt.sign({user:user},"secretkey",(err,token)=>{
    tokens=token
  })
  if(user){
    let posts=await helpers.getData()
    let comments=posts.comment;
    res.cookie("token",tokens,{httpOnly:true}).render('logged',{user,posts,comments});
  }

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
router.get('/add-posts',verifyToken, async(req,res)=>{
  if(req.user)
  res.render('add-post')
  else
  redirect('/')
})
router.post('/add-posts',(req,res)=>{
  let image=req.files.Image;
  helpers.addPost(req.body,(id)=>{
    image.mv('./public/images/'+id+'.jpg',async(err,done)=>{
      res.redirect('/');
    })
  })
})
router.get('/login/delete/:id',verifyToken, async(req,res)=>{
  if(req.user){
  let id=req.params.id;
  let status=await helpers.delete(id);
  res.redirect('/');
  }else
  res.render('/');
  
})
router.post('/comment',verifyToken, async(req,res)=>{
  if(req.user){
    await helpers.comment(req.body);
    res.redirect('/');
  }else
  res.redirect('/');

})
router.get('/logout',(req,res)=>{
 res.clearCookie('token').redirect('/');
 
})

module.exports = router;
