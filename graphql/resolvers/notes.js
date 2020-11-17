const Note = require("../../models/note");
const User = require("../../models/user");

const { parseNoteData } = require("./merge");

module.exports = {
  // GET ALL NOTES
  notes: () => {
    return Note.find()
      .then((notes) => {
        return notes.map((note) => {
          return parseNoteData(note);
        });
      })
      .catch((err) => {
        throw new Error("Something happened");
      });
  },
  // GET ALL NOTES FROM CURRENT USER
  userNotes: (args) => {
    return Note.find({ author: args.unInput._id })
      .then((notes) => {
        return notes.map((note) => {
          return parseNoteData(note);
        });
      })
      .catch((err) => {
        throw new Error("Something happened with user's notes");
      });
  },
  // CREATE A NOTE
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
  editNote: async ({ _id, category, body }) => {
    const note = await Note.findOne({ _id: _id });
    if (note) {
      await Note.updateOne(
        { _id: note._doc._id },
        { category: category, body: body }
      );
      return {
        _id: note._doc._id,
        category: note._doc.category,
        body: note._doc.body,
      };
    } else {
      throw new Error("Edit failed");
    }
  },
  deleteNote: async ({ _id }) => {
    const note = await Note.findOne({ _id: _id });
    if (note) {
      await Note.deleteOne({ _id: note._doc._id });
      return {
        _id: note._doc._id,
        category: note._doc.category,
        body: note._doc.body,
      };
    } else {
      throw new Error("Delete failed");
    }
  },
};
