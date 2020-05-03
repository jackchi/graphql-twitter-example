const { ApolloServer } = require('apollo-server');
const isEmail = require('isemail');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const { createStore } = require('./utils');

const UserAPI = require('./datasources/user');

const store = createStore();

const server = new ApolloServer({
  context: async ({ req }) => {
    // Simple HTTP Authorization Token on every request
    const auth = req.headers && req.headers.authorization || '';
    const user = await store.users.findOne({
      where: {
        password: auth
      }
    });
    return { user: { ...user.dataValues } };
  },
  typeDefs,
  resolvers,
  dataSources: () => ({
    userAPI: new UserAPI({ store })
  })
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});