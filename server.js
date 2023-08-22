import { ApolloServer, gql } from "apollo-server";

const typeDefs = gql`
  type User {
    id: ID
    username: String
  }
  type Tweet {
    id: ID
    text: String
    author: User
  }

  type Query {
    # 느낌표 표식은 graphQL에게 해당 필드들이 null이면 안된다고 알리는 역할
    allTweets: [Tweet!]!
    tweet(id: ID): Tweet
  }

  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet!
    deleteTweet(id: ID!): Boolean!
  }
`;

const server = new ApolloServer({ typeDefs });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});
