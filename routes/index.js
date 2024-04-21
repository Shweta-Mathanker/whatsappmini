var express = require('express');
var router = express.Router();
var passport = require('passport');
var localStrategy = require('passport-local');
var users = require('./users');
const http=require('http');
passport.use(new localStrategy(users.authenticate()))
const socketIo = require('socket.io');
const app=express();
const server = http.createServer(app);
const io = socketIo(server);


/* GET home page. */
router.get('/', isloggedIn,function(req, res, next) {
  res.render('index');
});
router.get('/login',function(req,res,next){
  res.render('login')
})
router.get('/register',function(req,res,next){
  res.render('register')
})
router.get('/chat',isloggedIn,function(req,res,next){
  const username= req.user ? req.user.username:'Guest';
  const defaultProfilePicture = 'https://imgs.search.brave.com/USq6MEDfGp1sK39BUX9NknxQuqz9kVVfkyzx2MPsjMs/rs:fit:500:0:0/g:ce/aHR0cHM6Ly93d3cu/cG5naXRlbS5jb20v/cGltZ3MvbS8xNTAt/MTUwMzk0NV90cmFu/c3BhcmVudC11c2Vy/LXBuZy1kZWZhdWx0/LXVzZXItaW1hZ2Ut/cG5nLXBuZy5wbmc';
  const friends=req.user.friend
  res.render('chat',{friends,username, defaultProfilePicture});
})

  router.post('/register', (req, res, next) => {
  var newUser = {
    //user data here
    username: req.body.username,
    email: req.body.email,
    fullName: req.body.name,
    phoneNumber:req.body.phoneNumber
    //user data here
  };
  users
    .register(newUser, req.body.password)
    .then((result) => {
      passport.authenticate('local')(req, res, () => {
        //destination after user register
        res.redirect('/chat');
      });
    })
    .catch((err) => {
      res.send(err);
    });
});
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/chat',
    failureRedirect: '/register',
  }),
  
  (req, res, next) => { }
);
router.get('/logout', (req, res, next) => {
  if (req.isAuthenticated())
    req.logout((err) => {
      if (err) res.send(err);
      else res.redirect('/register');
    });
  else {
    res.redirect('/register');
  }
});
function isloggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  else res.redirect('/login');
}


module.exports = router;
