const jwt = require("jsonwebtoken");

const User = require("../models/user.model");
const config = require("../config/config");

const signin = (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err || !user) {
      return res.status(404).render("error.ejs", {
        title: "Please Login",
        message: "No user found.",
      });
    }
    if (!user.authenticate(req.body.password)) {
      return res.status(401).render("error.ejs", {
        title: "Couldn't Signin",
        message: "Email and password don't match.",
      });
    }
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      config.JWT_SECRET
    );
    res.cookie("t", token, {
      expire: new Date() + 9999,
    });
    return res.status(200).redirect("/");
  });
};

const signout = (req, res) => {
  res.clearCookie("t");
  return res.status(200).redirect("/");
};

const requireSignIn = (req, res, next) => {
  if (!req.cookies.t)
    return res.status(401).render("error.ejs", {
      title: "Please Login",
      message: "Please login to continue",
    });
  const decoded = jwt.verify(req.cookies.t, config.JWT_SECRET);
  req.auth = decoded;
  next();
};

const hasAuthorization = (req, res, next) => {
  const authorized = req.profile && req.auth && req.auth._id == req.profile._id;
  if (!authorized) {
    return res.status(401).render("error.ejs", { message: "Unauthorizes" });
  }
  next();
};

module.exports = { signin, signout, requireSignIn, hasAuthorization };