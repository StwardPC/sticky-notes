// IMPORTS
const express = require("express");
const body_parser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const app = express();
const Note = require("./models/note");
const User = require("./models/user");

app.use(body_parser.json());

app.use(
  "/graphql",
  graphqlHTTP({
    schema: buildSchema(`
      type Note {
        _id: ID!
        category: String!
        body: String!
        author: String!
        date: String!
      }
      type User {
        _id: ID!
        role: String!
        username: String!
        fullName: String!
        email: String!
        password: String
      }
      input NoteInput {
        category: String!
        body: String!
        author: String!
        date: String!
      }
      input UserInput {
        username: String!
        fullName: String!
        email: String!
        password: String
      }
    
      type RootQuery {
        notes: [Note!]!
      }
      
      type RootMutation {
        createNote(nInput: NoteInput): Note
        createUser(uInput: UserInput): User
      }
      
      schema{
        query: RootQuery 
        mutation: RootMutation
      }
    `),
    rootValue: {
      // this is the bundle of resolvers
      notes: () => {
        return Note.find(/*{category: "Home" }*/)
          .then((notes) => {
            return notes.map((notes) => {
              // _doc returns all the data I want
              // the second argument substitute the specific key I want in _doc
              return { ...notes._doc, _id: notes._doc._id.toString };
            });
          })
          .catch((err) => {
            throw err;
          });
      },
      users: () => {
        return User.find()
          .then((users) => {
            return users.map((users) => {
              return { ...users._doc, _id: users._doc._id.toString };
            });
          })
          .catch((err) => {
            throw err;
          });
      },
      createNote: (args) => {
        const newNote = new Note({
          category: args.nInput.category,
          body: args.nInput.body,
          author: args.nInput.author,
          date: new Date(args.nInput.date),
        });
        return newNote
          .save()
          .then((result) => {
            console.log(result);
            return { ...result._doc };
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      },
      createUser: (args) => {
        return User.findOne({
          email: args.uInput.email,
        })
          .then((user) => {
            if (user) {
              throw new Error("Email already exists");
            } else {
              return User.findOne({
                username: args.uInput.username,
              }).then((user) => {
                if (user) {
                  throw new Error("Username already exists");
                } else {
                  return bcrypt.hash(args.uInput.password, 12);
                }
              });
            }
          })
          .then((encryptedPassword) => {
            const newUser = new User({
              role: "Administrator",
              username: args.uInput.username,
              fullName: args.uInput.fullName,
              email: args.uInput.email,
              password: encryptedPassword,
            });
            return newUser.save();
          })
          .then((result) => {
            return {
              ...result._doc,
              password: null,
              _id: result._doc._id.toString(),
            };
          })
          .catch((err) => {
            throw err;
          });
      },
    },
    graphiql: true, // this is for a UI and test your schemas
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@sticky-cluster.1vwdg.azure.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
    { useUnifiedTopology: true, useNewUrlParser: true }
  )
  .then(() => {
    app.listen("3000");
  })
  .catch((err) => {
    console.log("Connection error");
  });
