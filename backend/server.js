require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
var cors = require("cors");
var multer = require("multer");
var upload = multer();
const userRoutes = require("./routes/userRoutes");
const buzzRoutes = require("./routes/buzzRoutes");
const profileRoutes = require("./routes/profileRoutes");

const app = express();

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});
app.use(cors());
app.use(express.json());
app.use(upload.array());
app.use(express.static("public"));

app.use("/user", userRoutes);
app.use("/buzz", buzzRoutes);
app.use("/profile", profileRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    if (process.env.NODE_ENV !== "test") {
      app.listen(process.env.PORT, () => {
        console.log("connected to db & listening on port", process.env.PORT);
      });
    }
  })
  .catch((error) => {
    console.log(error);
  });

module.exports = app;
