const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const {
  BAD_REQUEST,
  CONFLICT,
  NOT_FOUND,
  UNAUTHORIZED,
} = require("../utils/errors");

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    console.error("Invalid ID format:", userId);
    const error = new Error("Invalid user ID format.");
    error.statusCode = BAD_REQUEST;
    return next(error);
  }

  return User.findById(userId)
    .then((user) => {
      if (!user) {
        const error = new Error("User not found.");
        error.statusCode = NOT_FOUND;
        return next(error);
      }
      return res.send(user);
    })
    .catch((err) => {
      console.error("Error in getCurrentUser:", err.message);
      next(err);
    });
};

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!name || !avatar || !email || !password) {
    console.error("Validation Error: All fields are required");
    const error = new Error(
      "All fields ('name', 'avatar', 'email', and 'password') are required."
    );
    error.statusCode = BAD_REQUEST;
    return next(error);
  }

  return User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        console.error(`Conflict Error:${email} is already registered`);
        const error = new Error("A user with this email already exists.");
        error.statusCode = CONFLICT;
        return next(error);
      }

      return bcrypt
        .hash(password, 10)
        .then((hashedPassword) =>
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
    .catch((err) => {
      console.error("Error in createUser:", err.message);
      if (err.name === "ValidationError") {
        const validationError = new Error("Bad Request");
        validationError.statusCode = 400;
        return next(validationError);
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    console.error("Validation Error: Email and password are required");
    const error = new Error("Email and password are required.");
    error.statusCode = BAD_REQUEST;
    return next(error);
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({ token });
    })
    .catch((err) => {
      console.error("Authentication Error:", err.message);
      if (err.message === "Incorrect email or password") {
        console.error("Invalid data provied");
        const error = new Error("Invalid data provided.");
        error.statusCode = UNAUTHORIZED;
        return next(error);
      }

      return next(err);
    });
};

const updateProfile = (req, res, next) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  if (!name || !avatar) {
    console.error(
      "Validation Error: Both 'name' and 'avatar' fields are required."
    );
    const error = new Error("Both 'name' and 'avatar' fields are required.");
    error.statusCode = BAD_REQUEST;
    return next(error);
  }

  return User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        console.error("user not found");
        const error = new Error("User not found.");
        error.statusCode = NOT_FOUND;

        return next(error);
      }
      return res.send(updatedUser);
    })
    .catch((err) => {
      console.error("Update Profile Error:", err.message);
      return next(err);
    });
};

module.exports = { getCurrentUser, createUser, login, updateProfile };
