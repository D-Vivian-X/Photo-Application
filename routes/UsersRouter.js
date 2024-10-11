const express = require("express");
const UsersRouter = express.Router();
const db = require("../models");
const bodyParser = require("body-parser");
const { response } = require("express");
UsersRouter.use(bodyParser.urlencoded());
UsersRouter.use(bodyParser.json());
const bcrypt = require("bcryptjs");
const saltRounds = 10;

UsersRouter.route("/login").post((request, response) => {
  const password = request.body.password;
  const username = request.body.username;
  db.user
    .findOne({ where: { username: username, password: password } })
    .then(async (user) => {
      if (user) {
        await bcrypt.compare(password, user.password, (error, same) => {
          if (same) {
            request.session.useId = user.id;
            console.log(request.session);
            console.log("Logged In");
            response.redirect("/");
          } else {
            response.status(401);
            console.log("401 error");
            response.redirect("/badlogin");
          }
        });
      } else {
        response.send("No such user");
      }
      // response.send(user);
      response.redirect("/");
    })
    .catch((error) => {
      response.send("You do not have an account. Try signning up!");
    });
});

UsersRouter.route("/signUp").post(async (request, response) => {
  const email = request.body.email;
  const password = request.body.password;
  const encryptPassword = await bcrypt.hash(password, saltRounds);
  const username = request.body.username;

  db.user
    .create({ email: email[0], username: username, password: encryptPassword })
    .then((user) => {
      // response.send(user);
      response, redirect("/login");
    })
    .catch((error) => {
      response.send("You do not have an account. Try signning up!");
    });
});

module.exports = UsersRouter;
