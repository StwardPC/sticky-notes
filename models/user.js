const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  role: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdNotes: [
    {
      type: Schema.Types.ObjectID,
      ref: "Note",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
