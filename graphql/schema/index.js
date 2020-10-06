const { buildSchema } = require("graphql");

module.exports = buildSchema(`
      type Note {
        _id: ID!
        category: String!
        body: String!
        date: String!
        author: User!
      }
      type User {
        _id: ID!
        role: String!
        username: String!
        fullName: String!
        email: String!
        password: String
        createdNotes: [Note!]
      }
      
      type AuthData {
        userID: ID!
        token: String!
        tokenExpiration: Int!
      }
      
      input NoteInput {
        category: String!
        body: String!
      }
      input UserInput {
        username: String!
        fullName: String!
        email: String!
        password: String
      }
    
      type RootQuery {
        notes: [Note!]!
        login(email: String!, password: String!): AuthData!
      }
      
      type RootMutation {
        createNote(nInput: NoteInput): Note
        createUser(uInput: UserInput): User
      }
      
      schema{
        query: RootQuery 
        mutation: RootMutation
      }
    `);
