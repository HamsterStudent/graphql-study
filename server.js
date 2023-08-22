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
  # Query는 GET request를 만드는 것과 같음
  # Query타입에 필드를 만드는 것은
  # rest API에서 Get HTTP방법으로 url을 만들고 노출시키는 것과 같음
  type Query {
    allTweets: [Tweet]
    tweet(id: ID): Tweet
  }
  # Mutation은 POST request를 만드는 것과 같음
  # user가 보낸 data로 mutate하는 동작들을 모두 넣음
  # backend를 mutate하게 하고 싶거나
  # user가 data를 보내게 해서 backend에 업로드 하고 싶은 경우,
  # database를 수정하고 cache를 지우고 logout기능을 작동시키고 싶은 경우 등

  # Mutation타입에 필드를 만드는 것은
  # rest API에서 url을 노출시키고 POST HTTP방법으로 그걸 관리하는 것과 같음
  # rest API에선 DELETE나 PUT를 하려면 따로 설정해줘야하지만,
  # GraphQL에서는 Query가 아니면 Mutation중 하나만 택해서 동작시킨다
  type Mutation {
    postTweet(text: String, userId: ID): Tweet
    deleteTweet(id: ID): Boolean
  }
`;

const server = new ApolloServer({ typeDefs });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});
