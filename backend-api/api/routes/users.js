const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../models/user");

router.get("/", (req, res) => {
  const hostname = req.headers.host;
  User.find({}, { __v: 0 })
    .then((docs) => {
      const result = {
        count: docs.length,
        users: docs.map((doc) => {
          const obj = {
            ...doc._doc,
            result: "http://" + hostname + "/users/" + doc._id,
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
      });
      user
        .save()
        .then((retult) => {
          res.status(201).json({
            message: "User Created",
            result: "http://" + hostname + "/users/" + User._id,
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            error: err,
          });
        });
    }
  });
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
