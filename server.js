import { ApolloServer, gql } from "apollo-server";

const typeDefs = gql`
  # query 타입은 필수적으로 들어가야 함
  # restAPI에서 GET /text라고 쓰는 것과 같음(GET request url 노출과 같다)
  # 사용자가 request할 수 있게 하려면 무조건 Query안에 넣어야 함
  type Query {
    text: String
    hello: String
  }
`;

const server = new ApolloServer({ typeDefs });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});
