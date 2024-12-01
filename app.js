const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("connected to DB");
  })
  .catch(console.error);

app.use(express.json());
app.use("/", mainRouter);
app.use((req, res) => {
    res.status(404).send({ message: "Requested resource not found." });
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
