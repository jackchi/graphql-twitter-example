const { gql } = require('apollo-server');

const typeDefs = gql`
  # GraphQL Schemas  
type User {
  id: ID!
  email: String!
  posts: [Post]
}

type Post {
  id: ID!
  message: String
  userId: ID
  createdAt: String
  updatedAt: String
}

type Query {
  me: User
  posts: PostConnection
}

type Mutation {
  register(email: String, password: String): RegisterResponse!
  login(email: String, password: String): LoginResponse
  createPost(message: String): PostUpdateResponse!
}

"""
Responses back to clients
"""
type LoginResponse {
  success: Boolean!
  message: String
  token: String # login token
}

type RegisterResponse {
  success: Boolean!
  message: String
  email: String
}

type PostUpdateResponse {
  success: Boolean!
  message: String
  userId: ID
}

type PostConnection {
  count: Int
  posts: [Post]
}
`;

module.exports = typeDefs;
