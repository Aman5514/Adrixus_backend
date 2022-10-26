const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLSchema,
} = require("graphql");
const { userLists } = require("./StaticData");

const userType = new GraphQLObjectType({
  name: "users",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    body: { type: GraphQLString },
  }),
});

const rootQuery = new GraphQLObjectType({
  name: "rootQuery",
  fields: {
    users: {
      type: new GraphQLList(userType),
      resolve(parent, args) {
        return userLists;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: rootQuery,
});
