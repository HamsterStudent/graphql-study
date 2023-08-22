import { ApolloServer, gql } from "apollo-server";

// 가짜 데이터베이스.
// GraphQL에 알려줬던 형태대로 구현해야 함
const tweets = [
  {
    id: "1",
    text: "hello",
  },
  {
    id: "2",
    text: "hamster",
  },
];

// GraphQL Schema 정의 언어
// 어떤 프로그래밍 언어를 사용하던 간에 이 언어는 같다.
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

const resolvers = {
  // Schma정의 언어와 꼭 이름이 같아야 함
  // 누군가 쿼리 타입의 tweet필드를 요청하면 이쪽으로 와서
  // 해당 함수를 호출한다.
  Query: {
    allTweets() {
      return tweets;
    },
    // apollo는 argments를 두개씩 보낸다 : root, user가 보내는 args
    // user가 args를 보낼 때,
    // 해당 args들은 항상 resolver func의 두번째 args가 된다
    tweet(root, { id }) {
      return tweets.find((tweet) => tweet.id === id);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});
