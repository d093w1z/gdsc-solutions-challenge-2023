const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../models/user");

User.init().then(function (Event) {
  console.log("Indexes Builded");
});

router.get("/", (req, res) => {
  const hostname = req.headers.host;
  User.find({}, { __v: 0 })
    .then((docs) => {
      const result = {
        count: docs.length,
        users: docs.map((doc) => {
          const obj = {
            ...doc._doc,
            result: {
              method: "GET",
              url: "http://" + hostname + "/users/" + doc._id,
            },
          };
          return obj;
        }),
      };
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/signup", (req, res, next) => {
  const hostname = req.headers.host;
  bcrypt.hash(req.body.uuid, 10, (err, hash) => {
    if (err) {
      console.log(req.body);
      return res.status(500).json({
        error: err,
      });
    } else {
      const user = User({
        _id: new mongoose.Types.ObjectId(),
        email: req.body.email,
        uuid: hash,
        phone: req.body.phone,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      });
      user
        .save()
        .then((retult) => {
          res.status(201).json({
            success: true,
            message: "User Created",
            result: {
              method: "GET",
              url: "http://" + hostname + "/users/" + user._id,
            },
          });
        })
        .catch((err) => {
          console.log(err);
          if (err.code === 11000) {
            return res
              .status(422)
              .json({ success: false, message: "User already exist!" });
          }
          return res.status(422).send(err);
        });
    }
  });
});

router.get("/signup", (req, res, next) => {
  const error = Error("Invalid request. Did you mean to send a POST request?");
  error.status = 400;
  next(error);
});

router.get("/:userId", (req, res) => {
  User.find({ _id: req.params.userId }, { __v: 0 })
    .then((docs) => {
      const result = {
        count: docs.length,
        users: docs,
      };
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
