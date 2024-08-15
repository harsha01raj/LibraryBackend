const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const UserModel = require("../model/user.model");

const UserRouter = express.Router();

UserRouter.post("/register", async (req, res) => {
  const { username, email, password, roles } = req.body;
  try {
    bcrypt.hash(password, 5, async (err, hash) => {
      if (err) {
        return res.status(400).json({ Message: err.message });
      }
      const user = new UserModel({
        username,
        email,
        password: hash,
        roles,
      });
      await user.save();
      res
        .status(200)
        .json({ Message: "User is succesfully register", user: user });
    });
  } catch (error) {
    res.status(400).json({ Message: error.message });
  }
});

UserRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // This line is used to find the user from the data base.
    const user = await UserModel.findOne({ email });

    // If user not found then.
    if (!user) {
      return res.status(404).json({ Message: "User not found..." });
    }

    // comapre the password of user.password and password
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        return res.status(400).json({ Message: err.message });
      }
      if (!result) {
        return res.status(200).json({ Message: "Wrong Password..." });
      }
      const token = jwt.sign({ user: user }, process.env.ACCESS_SECRET_KEY);
      res
        .status(200)
        .json({ Message: "User Sucessfully login...", Token: token });
    });
  } catch (error) {
    res.status(400).json({ Message: error.message });
  }
});

module.exports = UserRouter;
