require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const port = process.env.PORT || 8080;
const session = require("express-session");
const expressValidation = require("express-validator");
const db = require("./config/database");
const logger = require("morgan");
const httpStatus = require("http-status");
const path = require('path')

app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
app.use(bodyParser.json({ limit: "100mb" }));
app.use(cors());
db.connection().then((database) => {
  module.exports = database;
  app.use("/api/auth", require("./routes/auth.routes"));
  app.use(logger("dev"));
  app.use(
    session({
      secret: "adrixus_secret",
      resave: true,
      saveUninitialized: true,
    })
  );

  app.get("*", (req, res) => {
    res.status(httpStatus.NOT_FOUND).json({
      message: "Api Not found",
      code: httpStatus.NOT_FOUND,
      data: null,
    });
  });

  app.use((err, req, res, next) => {
    res.status(err.status).json({
      error: {
        message: err.isPublic ? err.message : httpStatus[err.status],
      },
    });
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});