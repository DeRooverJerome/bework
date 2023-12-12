require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Note = require("../models/Notes");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // check json web token exist
  if (token) {
    jwt.verify(token, "net ninja secret", async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect("/login");
      } else {
        req.user = await User.findById(decodedToken.id);
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

// check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, "net ninja secret", async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

const checkJob = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, "net ninja secret", async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.locals.notes = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        let notes = await Note.find({ user: user.id });
        res.locals.notes = notes;
        next();
      }
    });
  } else {
    res.locals.notes = null;
    next();
  }
};

module.exports = { requireAuth, checkUser, checkJob };
