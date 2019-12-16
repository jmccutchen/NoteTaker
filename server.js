// Dependencies
// =============================================================
const express = require("express");
const path = require("path");
const fs = require("fs");
const allNotes = require("./Develop/db/db.json")


// Sets up the Express App
// =============================================================
const app = express();
const PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./Develop/public"));


app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "./Develop/public/index.html"));
});

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "./Develop/public/notes.html"));
    
});

app.get("/api/allnotes", function (req, res) {
    
    fs.readFile('./Develop/db/db.json', "utf8", function (err, data) {
        if (err) throw err;
        const notesFile= JSON.parse(data);
        res.json(notesFile)
    })
});



app.get("/api/allnotes/:id", function (req, res) {
    let selection = req.params.ID
    console.log(selection)
})

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "./Develop/public/index.html"));
});

app.post("/api/allnotes", function (req, res) {

    var note = req.body

    fs.readFile('./Develop/db/db.json', "utf8", function (err, data) {
        if (err) throw err;
        console.log("data" + data)
        var json = JSON.parse(data)
        json.push(note)
        console.log("note" + note)
        fs.writeFile("./Develop/db/db.json", JSON.stringify(json), function (err) {
            if (err) throw err;
            console.log("the note was saved")
        })

    })
})

function getArray(json){
    return $.getJSON('./Develop/db/db.json');
};

app.delete("/api/allnotes/:id", function (req, res) {
  
    let deleteID = req.params.ID;
    let deleteObj = allNotes.find(note => note.id == deleteID);
    let deleteIndex = allNotes.indexOf(deleteObj);
    allNotes.splice(deleteIndex, 1)
    // res.sendStatus(deleteObj)

})

app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
})
