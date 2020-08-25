const User = require("../models/user.model");
const errorHandler = require("../helpers/dbErrorHandler");

const create = (req, res) => {
  console.log(req.body);
  const user = new User(req.body);
  user
    .save()
    .then((result) => {
      result.hashed_password = undefined;
      result.salt = undefined;
      res.status(200).redirect("/?isSignedup=success");
    })
    .catch((err) => {
      console.log("ERROR: ", err);
      const error = errorHandler.getErrorMessage(err);
      res.status(400).render("error.ejs", {
        title: "Couldn't make new account",
        message: error,
      });
    });
};

const list = (req, res) => {
  User.find((err, user) => {
    if (err) {
      return res.status(500).render("error.ejs", {
        message: "Couldn't get the users",
        title: "Error!",
      });
    }
    user.forEach((u) => {
      u.hashed_password = undefined;
      u.salt = undefined;
    });
    return res.status(200).render("user-list.ejs", {
      users: user,
      title: "Chitter | Users",
      user: req.auth,
    });
  });
};

const userByUsername = (req, res, next, username) => {
  //   console.log("USERNAME: ", username);
  User.findOne({ username }, (err, user) => {
    // console.log("user: ", user);
    if (err || !user) {
      return res
        .status(404)
        .render("error.ejs", {
          message: `No user of username: ${username}`,
          title: "Error!",
        });
    }
    req.profile = user;
    next();
  });
};

const read = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.status(200).render("user.ejs", {
    user: req.profile,
    title: `${req.profile.name}'s profile`,
  });
};

const update = (req, res) => {
  let user = req.profile;
  user.overwrite(req.body);
  user.save((err) => {
    if (err) {
      res.status(500).render("error.ejs", {
        message: errorHandler.getErrorMessage(err),
        title: "Error!",
      });
    }
  });
  user.hashed_password = undefined;
  user.salt = undefined;
  res.status(200).redirect(`/users/${req.profile.username}`);
};

const remove = (req, res) => {
  const user = req.profile;
  user.remove((err, deletedUser) => {
    if (err) {
      res.status(500).render("error.ejs", {
        message: errorHandler.getErrorMessage(err),
        title: "Error!",
      });
    }
    deletedUser.hashed_password = undefined;
    deletedUser.salt = undefined;
    res.status(200).redirect("/");
  });
};

module.exports = { list, create, userByUsername, read, remove, update };