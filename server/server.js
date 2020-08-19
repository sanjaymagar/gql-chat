const { GraphQLServer, PubSub } = require('graphql-yoga');
const connectDB = require('./config/db');

const Message = require('./models/schema');

const messages = [];
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

const subscribers = [];
const onMessageUpdates = fn => subscribers.push(fn);

const resolvers = {
  Query: {
    messages: () => messages,
  },
  Mutation: {
    onMessage: async (_, { user, content }) => {
      const id = messages.length;
      messages.push({ id, user, content });
      subscribers.forEach(fn => fn());
      const message = new Message({
        id,
        user,
        content,
      });

      // Save message
      await message.save();

      return id;
    },
  },
  Subscription: {
    messages: {
      subscribe: async (_, __, { pubsub }) => {
        const channel = Math.random().toString(35).slice(2, 15);
        onMessageUpdates(() => pubsub.publish(channel, { messages }));
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
