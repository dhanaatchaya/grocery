var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local');

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async function(req, email, password, done) {
    req.checkBody('email','Invalid email').notEmpty().isEmail();
    req.checkBody('password','Invalid password').notEmpty().isLength({min:4});
    var errors=req.validationErrors();
    if(errors){
        var messages=[];
        errors.forEach(function(error){
            messages.push(error.msg);
        });
        return done(null,false,req.flash('error',messages));

    }

  
    
    try {
        
        const user = await User.findOne({ 'email': email });
        if (user) {
            return done(null, false, { message: 'Email is already in use' });
        }

        var newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);

        await newUser.save();
        return done(null, newUser);
    } catch (err) {
        return done(err);
    }
}));

passport.use('local.signin', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async function(req, email, password, done) {
  req.checkBody('email','Invalid email').notEmpty();
  req.checkBody('password','Invalid password').notEmpty();
  var errors=req.validationErrors();
  if(errors){
      var messages=[];
      errors.forEach(function(error){
          messages.push(error.msg);
      });
      return done(null,false,req.flash('error',messages));

  }

  
  try {
      
      const user = await User.findOne({ 'email': email });
     
      if (!user) {
          return done(null, false, { message: 'No user found' });
      }
      if(!user.validPassword(password)){
        return done(null, false, { message: 'Wrong password' });
      }
      return done(null,user);
   
  } catch (err) {
      return done(err);
  }
}));

