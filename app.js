// IMPORTS
const express = require("express");
const body_parser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

const app = express();

app.use(body_parser.json());

app.use(
  "/graphql",
  graphqlHTTP({
    schema: buildSchema(`
      type RootQuery {
        notes: [String!]!
      }
      
      type RootMutation {
        createNote(body: String): String
      }
      
      schema{
        query: RootQuery 
        mutation: RootMutation
      }
    `),
    rootValue: {
      // this is the bundle of resolvers
      notes: () => {
        return [
          "This is for tomorrow",
          "Make dinner",
          "Study this next week",
          "Gotta remember to sleep",
        ];
      },
      createNote: (args) => {
        const noteBody = args.body;
        return noteBody;
      },
    },
    graphiql: true, // this is for a UI and test your schemas
  })
);

app.listen("3000");
