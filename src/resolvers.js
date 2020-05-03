const { paginateResults } = require('./utils');

module.exports = {
  Query: {
    me: async (_, __, { dataSources }) =>
      dataSources.userAPI.findUser(),
    posts: async (_, __, {dataSources}) => {
        const results = await dataSources.userAPI.posts();
        return results
    },
  },
  Mutation: {
    login: async (_, { email, password }, { dataSources }) => {
      const resp = await dataSources.userAPI.login({ email, password });
      return resp
    },
    register: async (_, { email, password }, { dataSources }) => {
        const resp = await dataSources.userAPI.register({email, password});
        return resp;
    },
    createPost: async (_, { message }, {dataSources} ) => {
        const results = await dataSources.userAPI.createPost({ message });
        return {
            success: results.message == message,
            message: results.message,
            userId: results.userId,
        }
    },
  },
};