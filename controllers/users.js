const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const {
  BAD_REQUEST,
  CONFLICT,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED,
} = require("../utils/errors");

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    const error = new Error("Invalid user ID format.");
    error.statusCode = BAD_REQUEST;
    return next(error);
  }

  User.findById(userId)
    .then((user) => {
      if (!user) {
        const error = new Error("User not found.");
        error.statusCode = NOT_FOUND;
        return next(error);
      }
      return res.send(user);
    })
    .catch(next); 
};


const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!name || !avatar || !email || !password) {
    const error = new Error(
      "All fields ('name', 'avatar', 'email', and 'password') are required."
    );
    error.statusCode = BAD_REQUEST;
    return next(error);
  }

  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        const error = new Error("A user with this email already exists.");
        error.statusCode = CONFLICT;
        return next(error);
      }

      return bcrypt.hash(password, 10).then((hashedPassword) =>
        User.create({ name, avatar, email, password: hashedPassword })
      );
    })
    .then((user) => {
      const userResponse = {
        _id: user._id,
        name: user.name,
        avatar: user.avatar,
        email: user.email,
      };
      return res.status(201).send(userResponse);
    })
    .catch(next); 
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = new Error("Email and password are required.");
    error.statusCode = BAD_REQUEST;
    return next(error);
  }

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        const error = new Error("Invalid data provided.");
        error.statusCode = UNAUTHORIZED;
        return next(error);
      }
      next(err); 
    });
};


const updateProfile = (req, res, next) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  if (!name || !avatar) {
    const error = new Error("Both 'name' and 'avatar' fields are required.");
    error.statusCode = BAD_REQUEST;
    return next(error);
  }

  User.findByIdAndUpdate(userId, { name, avatar }, { new: true, runValidators: true })
    .then((updatedUser) => {
      if (!updatedUser) {
        const error = new Error("User not found.");
        error.statusCode = NOT_FOUND;
        return next(error);
      }
      return res.send(updatedUser);
    })
    .catch(next); 
};

module.exports = { getCurrentUser, createUser, login, updateProfile };
