const { GraphQLServer, PubSub } = require('graphql-yoga');
const connectDB = require('./config/db');

const Message = require('./models/schema');

const typeDefs = `
  type Message {
    id: ID!
    user: String!
    content: String!
  }

  type Query {
    messages: [Message!]
  }

  type Mutation {
    onMessage(user: String!, content: String!): ID!
  }

  type Subscription {
    messages: [Message!]
  }
`;

const channel = Math.random().toString(35).slice(2, 15);
const messages = async () => await Message.find();

const resolvers = {
  Query: {
    messages: () => messages,
  },
  Mutation: {
    onMessage: async (_, { user, content }, { pubsub }) => {
      const id = messages.length;
      const message = new Message({
        id,
        user,
        content,
      });

      // Save message
      await message.save();

      const newMessages = await Message.find();
      setTimeout(() => pubsub.publish(channel, { messages }), 0);
      pubsub.publish(channel, { messages: newMessages });

      return id;
    },
  },
  Subscription: {
    messages: {
      subscribe: async (_, __, { pubsub }) => {
        // Inital state
        setTimeout(() => pubsub.publish(channel, { messages }), 0);
        return pubsub.asyncIterator(channel);
      },
    },
  },
};

const pubsub = new PubSub();

const server = new GraphQLServer({ typeDefs, resolvers, context: { pubsub } });

connectDB();

server.start(({ port }) =>
  console.log(`🚀 Server is running on http://localhost:${port}`)
);
