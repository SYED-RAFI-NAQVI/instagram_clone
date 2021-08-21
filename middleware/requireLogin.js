const jwt = require("jsonwebtoken");
const JWT_SECRET = "qwertyuiop";
const { json } = require("express");
const mongoose = require("mongoose");
const user = require("../models/user");
const User = mongoose.model("User");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  // authorization ==== Bearer dgasgadsv
  if (!authorization) {
    return res.status(401).json({ error: "you must be logged in" });
  }
  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      return res.json({ err: "you must be logged in" });
    }

    //_id from auth
    const { _id } = payload;
    User.findById(_id).then((userdata) => {
      req.user = userdata; //can access email, name, password
      next();
    });
  });
};
