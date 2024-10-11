const express = require("express");
const PhotosRouter = express.Router();
const db = require("../models");
const multer = require("multer");

const fileStorageEngine = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(null, "./public/images");
  },
  filename: (request, file, callback) => {
    callback(null, Date.now() + "--" + file.originalname);
  },
});

const uploadFilter = function (request, file, callback) {
  const fileType = file.mimetype.split("/");

  if (fileType[0] === "image") {
    callback(null, true);
  } else {
    callback(
      new Error(
        "You are trying to upload a file that is not an image. Go back and try again"
      ),
      false
    );
  }
};

const upload = multer({
  fileFilter: uploadFilter,
  storage: fileStorageEngine,
});

PhotosRouter.use((error, request, response, next) => {
  if (error instanceof multer.MulterError) {
    console.error("Multer error:", error);
    response.status(400).json({ error: error.message });
  } else if (error) {
    console.error("Unknown error:", error);
    response.status(500).json({ error: error.message });
  } else {
    next();
  }
});

PhotosRouter.route("/").get((request, response) => {
  db.photo
    .findAll()
    .then((photos) => {
      console.log("GET IMAGES");
      response.send(photos);
      //response.redirect("/");
    })
    .catch((error) => {
      response.send(error);
    });
});

PhotosRouter.route("/:photoId").get((request, response) => {
  const photoId = request.params.photoId;
  db.comment
    .findAll({ where: { photoId: photoId } })
    .then((comment) => {
      response.send(comment);
    })
    .catch((error) => {
      response.send(error);
    });
});
PhotosRouter.route("/").post(upload.single("photo"), (request, response) => {
  console.log("Received POST /images request");

  const title = request.body.title;
  const mediaLocation = request.file ? request.file.filename : null;
  db.photo
    .create({ title: title, mediaLocation: mediaLocation })
    .then((photo) => {
      console.log("POST IMAGES");
      // response.send(photo);
      response.redirect("/");
    })
    .catch((error) => {
      console.error("Error saving photo:", error);
      response
        .status(500)
        .json({ error: "An error occurred while saving the photo." });
    });
});

module.exports = PhotosRouter;
