//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcypt = require("bcrypt");
const saltRound = 10;
const app = express();
const port = 3000;

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", function (req, res) {
  bcypt.hash(req.body.password, saltRound, function (err, hash) {
    const newUser = new User({
      email: req.body.username,
      password: hash,
    });
    newUser
      .save()
      .then(() => {
        res.render("secrets");
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({ email: username })
    .then((user) => {
      if (user) {
        bcypt.compare(password, user.password, function (err, result) {
          if (result === true) {
              res.render("secrets");
          }else{
            console.log("Wrong password");
            
          }
        });
      } else {
        console.log("Email not registerd");
      }
    })
    .catch((err) => {
      console.log(err);
    });
});
app.listen(port, () => {
  console.log(`the server is running on localhost:${port}`);
});
