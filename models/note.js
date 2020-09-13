const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const noteSchema = new Schema({
  category: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  creator: {
    type: Schema.Types.ObjectID,
    ref: "User",
  },
});

module.exports = mongoose.model("Note", noteSchema);
