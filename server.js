//
const express = require("express");
const app = express(); // No need for 'new' keyword here
const db = require("./models");
const bodyParser = require("body-parser");
const logger = require("morgan");
const expressSession = require("express-session");

app.use(expressSession({ secret: "Viv" }));

global.loggedIn = null;
app.use("*", (request, response, next) => {
  loggedIn = request.session.userId;
  next();
});
app.use(bodyParser.json());
app.use(logger("dev"));
app.use(express.static(`public`));
app.set("view engine", "ejs");

const PhotosRouter = require("./routes/PhotosRouter");
const CommentsRouter = require("./routes/CommentsRouter");
const UsersRouter = require("./routes/UsersRouter");
const PageRouter = require("./routes/PageRouter");
const { response } = require("express");

app.use("/images", PhotosRouter);
app.use("/comments", CommentsRouter);
app.use("/users", UsersRouter);
app.use("/", PageRouter);

// Start the server after database sync
const port = 8080;
db.sequelize
  .sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`Serving photo app on http://localhost:${port}`);
      console.log(`MariaDB connection successful.`);
    });
  })
  .catch((error) => {
    console.error("Unable to connect to the database", error);
  });
