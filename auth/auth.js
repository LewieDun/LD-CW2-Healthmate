const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const errorCheck = 'Please Input All Values Below';


exports.login = function (req, res,next) {
  let username = req.body.username;
  let password = req.body.password;

  if(username === '' || password === '')
  {
    const errorCheck = 'Please Input All Values Below';
    return res.render("user/login",
    {
      warning: errorCheck
    });
  }  

  userModel.lookup(username, function (err, user) {
    if (err) {
      console.log("error looking up user", err);
      return res.status(401).send();
    }
    if (!user) {
      console.log("user ", username, " not found");
      return res.render("user/login");
    }
    //compare provided password with stored password
    bcrypt.compare(password, user.password, function (err, result) {
      if (result) {
        //use the payload to store information about the user such as username.
        let payload = { username: username };
        //create the access token 
        let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET,{expiresIn: '1h'}); 
        res.cookie("jwt", accessToken);
        next();
      } else {
        return res.render("user/login"); 
      }
    });
  });
};

exports.verify = function (req, res, next) {
  let accessToken = req.cookies.jwt;
  if (!accessToken) {
   return res.redirect("/"); 
  }
  let payload;
  try {
    console.log("checking");
    payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    console.log(payload);
    req.username = payload.username;  
    next();
  } catch (e) {
    //if an error occured return request unauthorized error
    res.redirect("/"); 
  }
};

exports.create = function (req, res,next) {
  let username = req.body.username;
  let password = req.body.password;
  let firstname = req.body.firstname;
  let lastname = req.body.lastname;

  if(username === '' || password === '' || firstname === '' || lastname === '')
  {
    return res.render("user/register",
    {
      warning: errorCheck
    });
  }

  userModel.lookup(username, function (err, user) {
    if (err) {
      console.log("error looking up user", err);
      return res.status(401).send();
    }
    if (user) {
      const msg = "Username: " + username + " is already taken";
      return res.render("user/register", {
        alert: msg
      });
    }
    userModel.create(firstname, lastname, username, password)
    next();
  });
};
