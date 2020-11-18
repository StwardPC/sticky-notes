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
      
      type currentUserData {
        fullName: String!
        username: String!
        email: String!
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
      input userNoteInput {
        _id: String!
      }
    
      type RootQuery {
        notes: [Note!]!
        login(email: String!, password: String!): AuthData!
        userNotes(unInput: userNoteInput): [Note!]!
        currentUser (_id: String!): currentUserData!
      }
      
      type RootMutation {
        createNote(nInput: NoteInput): Note
        editNote(_id: String!, category: String!, body: String!): Note
        deleteNote(_id: String!, userID: String!): Note
        createUser(uInput: UserInput): User
        deleteUser(_id: String!): User
      }
      
      schema{
        query: RootQuery 
        mutation: RootMutation
      }
    `);
