const express = require("express");
const mainRouter = require("./routes/index");
const errorHandler = require('./middlewares/error-handler');
const helmet = require("helmet");
const mongoose = require("mongoose");
const cors = require("cors");


const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("connected to DB");
  })
  .catch(console.error);

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/", mainRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
