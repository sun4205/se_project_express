const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const { NOT_FOUND } = require("./utils/errors");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("connected to DB");
  })
  .catch(console.error);

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: "674b680318d33a41755f13b0",
  };
  next();
});
app.use("/", mainRouter);
app.use((req, res) => {
  res
    .status(STATUS_CODE.NOT_FOUND)
    .send({ message: "Requested resource not found." });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
