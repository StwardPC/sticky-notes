const Note = require("../../models/note");
const User = require("../../models/user");

function findUserByID(ID) {
  return User.findById(ID)
    .then((user) => {
      return {
        ...user._doc,
        _id: user._doc._id.toString(),
        createdNotes: findNoteByID.bind(this, user._doc.createdNotes),
      };
    })
    .catch((err) => {
      throw new Error("User not found");
    });
}

function findNoteByID(ID) {
  return Note.find({ _id: { $in: ID } })
    .then((notes) => {
      return notes.map((note) => {
        return {
          ...note._doc,
          _id: note._doc._id.toString(),
          date: new Date(note._doc.date).toISOString(),
          author: findUserByID.bind(this, note._doc.author),
        };
      });
    })
    .catch((err) => {
      throw new Error("Note not found");
    });
}

function parseNoteData(note) {
  return {
    ...note._doc,
    _id: note._doc._id.toString(),
    date: new Date(note._doc.date).toISOString(),
    author: findUserByID.bind(this, note._doc.author),
  };
}

exports.findUserByID = findUserByID;
exports.findNoteByID = findNoteByID;
exports.parseNoteData = parseNoteData;
