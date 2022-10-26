require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const port = process.env.PORT || 8080;
const db = require("./config/database");
const schema = require("./schema/schema");
const { graphqlHTTP } = require("express-graphql");
const httpStatus = require("http-status");

app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
app.use(bodyParser.json({ limit: "100mb" }));
var corsOptions = {
  origin: "*",
};
app.use(cors(corsOptions));
db.connection().then((database) => {
  module.exports = database;
  app.use("/api/auth", require("./routes/auth.routes"));
  app.use(
    "/graphql",
    graphqlHTTP({
      schema,
      graphiql: true,
      pretty: true,
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
