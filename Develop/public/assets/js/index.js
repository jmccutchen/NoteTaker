var $noteTitle = $(".note-title");
var $noteText = $(".note-textarea");
var $saveNoteBtn = $(".save-note");
var $newNoteBtn = $(".new-note");
var $noteList = $(".list-container .list-group");


// activeNote is used to keep track of the note in the textarea
var activeNote = {};

// A function for getting all notes from the db
var getNotes = function() {
  return $.ajax({
    url: "/api/allnotes",
    method: "GET",
    contentType: "application/json"
  });
};

// A function for saving a note to the db
var saveNote = function(note) {

  return $.ajax({
    url: "/api/allnotes",
    data: note,
    method: "POST",
  }).done(()=>{
    console.log("note" + note)
  });
};

// A function for deleting a note from the db
var deleteNote = function(e) {
  $target = $(e.target);
  const ID = $target.attr('data-id');
  console.log("e" + e)
  
  return $.ajax({
    url: "/api/allnotes/" + ID,
    method: "DELETE",
    contentType: "application/json"
  }).done(()=>{
    console.log("ID" + ID)
  });;
};

// If there is an activeNote, display it, otherwise render empty inputs
var renderActiveNote = function() {
  $saveNoteBtn.hide();

  if (activeNote.id) {
    $noteTitle.attr("readonly", true);
    $noteText.attr("readonly", true);
    $noteTitle.val(activeNote.title);
    $noteText.val(activeNote.text);
  } else {
    $noteTitle.attr("readonly", false);
    $noteText.attr("readonly", false);
    $noteTitle.val("");
    $noteText.val("");
  }
};

// creates a unique ID
let uniqId = (function(){
  var i=0;
  return function() {
      return i++;
  }
})();

// Get the note data from the inputs, save it to the db and update the view
var handleNoteSave = function() {
  console.log("I clicked it")
  var newNote = {
    ID: uniqId(),
    title: $noteTitle.val(),
    text: $noteText.val()
    
  };

  saveNote(newNote).then(function(data) {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Delete the clicked note
var handleNoteDelete = function(event) {
  console.log(event);
  // prevents the click listener for the list from being called when the button inside of it is clicked
  event.stopPropagation();
  
  // console.log("noteid"+ note.ID)
  // console.log(this)
  var note = $(this)
    .parent(".list-group-item")
    .data();
  if (activeNote.ID === note.ID) {
    activeNote = {};
  }

  deleteNote(note.ID).then(function() {
    getAndRenderNotes();
    renderActiveNote();
    console.log("noteid"+ note.ID)
    console.log(note)
  });
};

// Sets the activeNote and displays it
var handleNoteView = function() {
  activeNote = $(this).data();
  renderActiveNote();
};

// Sets the activeNote to and empty object and allows the user to enter a new note
var handleNewNoteView = function() {
  activeNote = {};
  renderActiveNote();
};

// If a note's title or text are empty, hide the save button
// Or else show it
var handleRenderSaveBtn = function() {
  if (!$noteTitle.val().trim() || !$noteText.val().trim()) {
    $saveNoteBtn.hide();
  } else {
    $saveNoteBtn.show();
  }
};

// Render's the list of note titles
var renderNoteList = function(notes) {
  $noteList.empty();
  var noteListItems = [];

  for (var i = 0; i < notes.length; i++) {
    var note = notes[i];
    
    var $li = $("<li class='list-group-item'>").data(note);
    var $span = $("<span>").text(note.title);
    var $delBtn = $(
      `<i class='fas fa-trash-alt float-right text-danger delete-note' data-id='${note.ID}'>`
    );

    $li.append($span, $delBtn);
    noteListItems.push($li);
  }

  $noteList.append(noteListItems);
};

// Gets notes from the db and renders them to the sidebar
var getAndRenderNotes = function() {
  return getNotes().then(function(data) {
    renderNoteList(data);
  });
};

$saveNoteBtn.on("click", handleNoteSave);
$noteList.on("click", ".list-group-item", handleNoteView);
$newNoteBtn.on("click", handleNewNoteView);
$noteList.on("click", ".delete-note", handleNoteDelete);
$noteTitle.on("keyup", handleRenderSaveBtn);
$noteText.on("keyup", handleRenderSaveBtn);

// Gets and renders the initial list of notes
getAndRenderNotes();
