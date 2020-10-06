const Note = require("../../models/note");
const User = require("../../models/user");

const { parseNoteData } = require("./merge");

module.exports = {
  notes: () => {
    return Note.find(/*{category: "Home" }*/)
      .then((notes) => {
        return notes.map((note) => {
          return parseNoteData(note);
        });
      })
      .catch((err) => {
        throw new Error("Something happened");
      });
  },
  createNote: async (args, req) => {
    if (!req.isIn) {
      throw new Error("Login first");
    } else {
      const newNote = new Note({
        category: args.nInput.category,
        body: args.nInput.body,
        date: new Date().toISOString(),
        author: req.userID,
      });
      let createdNote;
      try {
        //const result = await newNote.save();
        createdNote = await newNote.save();
        const author = await User.findById(req.userID);

        if (!author) {
          throw new Error("User not found by ID");
        } else {
          author.createdNotes.push(newNote);
          await author.save();

          return createdNote;
        }
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
  },
};
