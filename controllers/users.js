const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const NotFoundError = require("../utils/errors/NotFoundError");
const UnauthorizedError = require("../utils/errors/UnauthorizedError");
const BadRequestError = require("../utils/errors/BadRequestError");
const ConflictError = require("../utils/errors/ConflictError");

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    console.error("Invalid ID format:", userId);

    return next(new BadRequestError("Invalid user ID format."));
  }

  return User.findById(userId)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError("User not found."));
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

    return next(
      new BadRequestError("Validation Error: All fields are required")
    );
  }

  return User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        console.error(`Conflict Error:${email} is already registered`);

        return next(
          new ConflictError("A user with this email already exists.")
        );
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
        return next(new BadRequestError("Bad Request"));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    console.error("Validation Error: Email and password are required");

    return next(new BadRequestError("Email and password are required."));
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

        return next(new UnauthorizedError("Invalid data provided."));
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

    return next(
      new BadRequestError("Both 'name' and 'avatar' fields are required.")
    );
  }

  return User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        console.error("user not found");

        return next(new NotFoundError("User not found."));
      }
      return res.send(updatedUser);
    })
    .catch((err) => {
      console.error("Update Profile Error:", err.message);
      return next(err);
    });
};

module.exports = { getCurrentUser, createUser, login, updateProfile };
