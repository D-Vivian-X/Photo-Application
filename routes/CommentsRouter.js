const express = require("express");
const CommentsRouter = express.Router();
const db = require("../models");

CommentsRouter.route("/").post((request, response) => {
  const userId = request.body.userId;
  const photoId = request.body.photoId;
  const content = request.body.content;
  db.create({
    userId: userId,
    photoId: photoId,
    content: content,
  })
    .then((comment) => {
      response.send(comment);
    })
    .catch((error) => {
      response.send(error);
    });
});
module.exports = CommentsRouter;
