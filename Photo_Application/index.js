const { response } = require("express");
const express = require("express");
const app = express();
const port = 8080;

app.listen(port, () => {});
app.get("/", (request, response) => {
  response.json({
    Hosting: "Vivian",
  });
});

console.log(`Listening on ${port}`);
