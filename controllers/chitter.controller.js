const Chitter = require("../models/chitter.model");
const User = require("../models/user.model");
const errorHandler = require("../helpers/dbErrorHandler");

const create = (req, res) => {
  const userId = req.auth.id;
  const username = req.auth.username;
  const body = {
    userId,
    chitter: req.body.chitter,
    username,
  };
  const newChitter = new Chitter(body);
  newChitter
    .save()
    .then((chitter) => {
      res.status(200).redirect("/");
    })
    .catch((err) => {
      res.status(500).render("error.ejs", {
        title: "Error!",
        message: errorHandler.getErrorMessage(err),
      });
    });
};

const list = (req, res) => {
  Chitter.find()
    .sort({ created: "desc" })
    .exec((err, chitter) => {
      if (err) {
        res.status(500).render("error.ejs", {
          message: "Couldn't get chitters.",
          title: "Error",
        });
      }
      res.status(200).render("chitters.ejs", {
        chitters: chitter,
        title: "Chitters",
        user: req.auth,
      });
    });
};

const findById = (req, res, next, id) => {
  Chitter.findById(id).exec((err, chitter) => {
    if (err || !chitter) {
      res.status(404).render("error.ejs", {
        message: "No Chitter Found",
        title: "Error!",
      });
    }
    req.chitter = chitter;
    next();
  });
};

const read = (req, res) => {
  return res.status(200).render("chitter.ejs", {
    chitter: req.chitter,
    title: `Chitter | ${req.chitter.chitter}`,
    user: req.auth,
    hasAuth: req.auth.username === req.chitter.username,
  });
};

const hasAuth = (req, res, next) => {
  if (req.auth.username === req.chitter.username) {
    next();
  }
};

const remove = (req, res) => {
  console.log("Entered");
  req.chitter.deleteOne((err, deletedChitter) => {
    if (err) {
      res.status(400).render("error.ejs", {
        title: "Couldn't Delete",
        message: "Couldn't delete this chitter.",
      });
    }
    res.status(400).redirect("/chitter");
  });
};

const newComment = (req, res) => {
  let chitter = req.chitter;
  const existingComment = chitter.comments;
  console.log(req.auth);
  let userId = req.auth.id;
  let username = req.auth.username;
  let comment = req.body.comment;
  const newComment = {
    userId,
    username,
    comment,
  };
  existingComment.push(newComment);
  chitter.updateOne({ comments: existingComment }, (err) => {
    if (err) {
      res.status(500).render("error.ejs", {
        message: errorHandler.getErrorMessage(err),
        title: "Error!",
      });
    }
  });
  res.status(200).redirect(`/chitter/${chitter._id}`);
};

module.exports = { create, list, findById, read, newComment, remove, hasAuth };