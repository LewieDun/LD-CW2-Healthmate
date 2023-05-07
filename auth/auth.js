const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const errorCheck = "Please Input All Values Below";

exports.login = function (req, res, next) {
  // Get username and password from request body
  let username = req.body.username;
  let password = req.body.password;

  // Check if username and password are not empty
  if (username === "" || password === "") {
    const errorCheck = "Please Input All Values Below";
    // Render login page with error message
    return res.render("user/login", { warning: errorCheck });
  }

  // Find user by username in database
  userModel.lookup(username, function (err, user) {
    if (err) {
      console.log("error looking up user", err);
      // Return unauthorized error if there is an error
      return res.status(401).send();
    }
    if (!user) {
      console.log("user ", username, " not found");
      // Render login page if user is not found
      return res.render("user/login");
    }
    // Compare provided password with stored password
    bcrypt.compare(password, user.password, function (err, result) {
      if (result) {
        // Use the payload to store information about the user such as username.
        let payload = { username: username };
        // Create the access token with a 1 hour expiration time
        let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: "1h",
        });
        // Set access token as a cookie and call next middleware
        res.cookie("jwt", accessToken);
        next();
      } else {
        // Render login page if passwords do not match
        return res.render("user/login");
      }
    });
  });
};

// Verify function for validating JWT token in cookies
exports.verify = function (req, res, next) {
  let accessToken = req.cookies.jwt;

  // Redirect to homepage if no JWT token found in cookies
  if (!accessToken) {
    return res.redirect("/");
  }

  let payload;
  try {
    console.log("checking");
    // Verify the access token with secret key and extract payload
    payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    console.log(payload);
    // Add the username to the request object
    req.username = payload.username;
    next();
  } catch (e) {
    //if an error occured return request unauthorized error
    res.redirect("/");
  }
};

// This function creates a new user account
exports.create = function (req, res, next) {
  // Extract user information from the request body
  let username = req.body.username;
  let password = req.body.password;
  let firstname = req.body.firstname;
  let lastname = req.body.lastname;

  // Check if any of the required fields are empty
  if (
    username === "" ||
    password === "" ||
    firstname === "" ||
    lastname === ""
  ) {
    // Set error message
    const errorCheck = "Please Input All Values Below";
    // Render registration page with error message
    return res.render("user/register", {
      warning: errorCheck,
    });
  }

  // Check if the username already exists
  userModel.lookup(username, function (err, user) {
    if (err) {
      // Log the error
      console.log("error looking up user", err);
      // Return unauthorized status code
      return res.status(401).send();
    }
    if (user) {
      // Set error message
      const msg = "Username: " + username + " is already taken";
      // Render registration page with error message
      return res.render("user/register", {
        alert: msg,
      });
    }
    // Create new user account
    userModel.create(firstname, lastname, username, password);
    next();
  });
};
