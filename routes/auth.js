const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "qwertyuiop";
const requireLogin = require("../middleware/requireLogin");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const EMAIL = "imsrn.me";
const SENDGRID_API =
  "SG.p35KGYC3Q96_M9A9hB7v4Q.4PmsjjDjVDTPpis3kdk37jmovH9HgNjoMypG69-TTmA";

const transporter = nodemailer.createTransport(
  sendgridTransport({
    service: "Gmail",
    auth: {
      api_key: SENDGRID_API,
    },
  })
);

router.get("/protected", requireLogin, (req, res) => {
  res.send("hello user");
});

//signup
router.post("/signup", (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!email || !name || !password) {
    return res.json("Fields are missing");
  }
  User.findOne({ email: email })
    .then((saveUser) => {
      if (saveUser) {
        return res.json("user already exists");
      }
      //hashing password
      bcrypt
        .hash(password, 15) //15 - size of the password
        .then((hashedpassword) => {
          const user = new User({
            email,
            password: hashedpassword, //assigning the hashed password to password
            name,
            pic,
          });

          user
            .save()
            .then((user) => {
              //   transporter.sendMail({
              //     to: user.email,
              //     from: "your verified address", //verifed address by sendGrid
              //     subject: "signup success",
              //     html: "<h1>welcome to instagram</h1>",
              //   });
              res.json({ message: "user sucessfully saved in Database" });
            })
            .catch((err) => {
              console.log(err);
            });
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

//singin

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ error: "Please fill the required fields" });
  }
  User.findOne({ email: email }).then((saveUser) => {
    if (!saveUser) {
      return res.json({ error: "email and passowrd are mis-match" });
    }
    //comparing the password from front-end and the password which stored in our database
    bcrypt
      .compare(password, saveUser.password)
      .then((doMatch) => {
        if (doMatch) {
          const token = jwt.sign({ _id: saveUser }, JWT_SECRET);
          const { _id, name, email, followers, following, pic } = saveUser;
          res.json({
            token,
            user: { _id, name, email, followers, following, pic },
          });
        } else {
          return res.json({ error: "Invalid email or password" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

router.post("/resetpassword", (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email }).then((user) => {
      if (!user) {
        return res.json({ error: "User don't exist" });
      }
      user.resetToken = token;
      user.expireToken = Date.now() + 3600000; //this token is only valid for one hour
      user.save().then((result) => {
        transporter.sendMail({
          to: user.email,
          from: "your verified address", //verifed address by sendGrid
          subject: "Reset Password",
          html: `
                    <p>Reset you password here</p>
                    <h5>Click here <a href = "${EMAIL}/resetpassword/${token}">RESET</a> your password</h5>`,
        });

        res.json({ message: "We have sent a reset link to your email" });
      });
    });
  });
});

router.post("/newpassword", (req, res) => {
  const newpassword = req.body.password;
  const sentToken = req.body.token;
  User.findOne({
    resetToken: sentToken,
    expireToken: { $gt: Date.now() },
  }).then((user) => {
    if (!user) {
      return res.json({ error: "Link Expired" });
    }
    bcrypt
      .hash(newpassword, 12)
      .then((hashedpassword) => {
        user.password = hashedpassword;
        user.resetToken = undefined;
        user.expireToken = undefined;
        user.save().then((savedUser) => {
          res.json({ message: "password Updated" });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

module.exports = router;
