const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const User = require('../models/User');
const bodyParser = require('body-parser');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var Response = require('../response.js');
var mongoose = require('mongoose');
mongoose.Types.ObjectId.isValid('/^[0-9a-fA-F]{24}$/');

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login', { user: req.user }));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register', {user:req.user}));


//edit 
// router.get('/edit', forwardAuthenticated, (req, res) => res.render('edit'));


  /* GET SINGLE User BY ID */
  router.get('/edit/:id', function(req, res) {
    User.findById(req.params.id, function (err, user) {
      if (err) {
        console.log(err);
      } else {
        res.render('edituser', { errorMsg: req.flash('errorMsg'),successMsg: req.flash('successMsg'), users: user, user:req.user });
      }
    });
  });
   
  /* UPDATE User */
  router.post('/edit/:id', function(req, res) {
    User.findByIdAndUpdate(req.params.id, req.body, function (err) {
      if(err){
        req.flash('errorMsg', 'Something went wrong! User could not updated.');
        res.redirect('/users/edit/'+req.params.id);
    } else {
      req.flash('successMsg', 'Profile updated.');
      console.log("Profile Updated");
      res.redirect('/users/edit/'+req.params.id);
    }
    });
  });

   /* DELETE User BY ID */
router.get('/destroy/:id', function(req, res) {
  User.findByIdAndRemove(req.params.id, function (err, project) {
    if (err) {
      req.flash('errorMsg', 'User not deleted successfully.');
      res.redirect('/');
    } else {
      console.log("User deleted")
      res.redirect('/');
    }
  });
});
 
   

/*
router.get('/edit/:id', function(req, res) {
  console.log(req.params.id);
  User.findById(req.params.id, function(err, user) {
      if (err) {
          console.log(err);
      } else {
          console.log(user);

          res.render('edituser', { users: user });
      }
  });
});

router.post('/edit/:id', function(req, res) {
  User.findByIdAndUpdate(req.params.id, req.body, function (err) {
    if(err){
      res.redirect('/users/edit/'+req.params.id);
  } else {
    req.flash('successMsg', 'User updated successfully.');
    res.redirect('/users/edit/'+req.params.id);
  }
  });
});
 

/*
router.post('/edit/:id', function(req, res) {

console.log("MyID is" + req.params.id);

const mybodydata = {
  username: req.body.username,
  email: req.body.email,
  fullname: req.body.fullname,
  password: req.body.password,
  address: req.body.address,
  address2: req.body.address2,
  postcode: req.body.postcode,
  city: req.body.city, 
  profile: req.body.profile,
  _id: req.body._id
}

  User.findByIdAndUpdate(req.params.id, mybodydata, function(err) {
      if (err) {
          res.redirect('edit/' + req.params.id);
      } else {
        
          res.redirect('dashboard');
      }
  });
});

*/

// Register
router.post('/register', (req, res) => {
  const { email, fullname, password, username, address, address2, postcode, city, profile, _id } = req.body;
  let errors = [];

  if (!email || !fullname || !password || !username ||!address ||!address2  ||!postcode ||!city ||!profile ||!_id) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      email,
      fullname,
      password,
      username,
      address,
      address2,
      postcode,
      city, 
      profile,
      _id
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          email,
          fullname,
      password,
      username,
      address,
      address2,
      postcode,
      city,
      profile,
      _id
        });
      } else {
        const newUser = new User({
          email,
          fullname,
          password,
          username,
          address,
          address2,
          postcode,
          city, 
          profile,
        _id
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});



// Get all users route
// GET Route
// @ route /users/allUsers
// @ public


router.get('/allUsers', ensureAuthenticated, async (req, res) => {
	await User.find({}, function(err, result) {
		if (err) throw err;
		searchResults = result;
	});
	res.render('allUsers', { results: searchResults, user: req.user });
});
  
router.get('/get-users-details-api/:id', function(req, res, next) {
  User.findById(req.params.id, function (err, post) {
    if(err){
      Response.errorResponse(err,res);
  }else{
      Response.successResponse('User Detail!',res,post);
  }
  });
});





  
// edit user 
// https://github.com/academind/node-restful-api-tutorial/blob/05-add-mongodb-and-mongoose/api/routes/products.js


// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
  
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;