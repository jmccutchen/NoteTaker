// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
var fs

// Sets up the Express App
// =============================================================
var app = express();
var PORT = 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "notes.html"));
});

app.get("/api/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "db.json"));
});

app.post("/api/notes", function(req, res) {

})

app.delete("/api/notes/:id", function(req, res) {

})

app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });