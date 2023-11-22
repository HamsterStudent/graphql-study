import { ApolloServer, gql } from "apollo-server";
import fetch from "node-fetch";

// 가짜 데이터베이스.
// GraphQL에 알려줬던 형태대로 구현해야 함
let tweets = [
  {
    id: "1",
    text: "hello",
    userId: "2",
  },
  {
    id: "2",
    text: "hamster",
    userId: "1",
  },
];

let users = [
  {
    id: "1",
    firstName: "ham",
    lastName: "ster",
  },
  {
    id: "2",
    firstName: "king",
    lastName: "burger",
  },
];

// GraphQL Schema 정의 언어
// 어떤 프로그래밍 언어를 사용하던 간에 이 언어는 같다.
const typeDefs = gql`
  type User {
    id: ID
    firstName: String!
    lastName: String!
    """
    Is the sum of firstName + lastName as a string
    """
    fullName: String!
  }

  # 타입에 대한 설명을 """으로 감싸면 기재할 수 있음
  """
  Tweet object represent a resource for a Tweet
  """
  type Tweet {
    id: ID
    text: String
    author: User
  }

  # GET으로 호출하는 느낌
  type Query {
    allMovies: [Movie!]!
    allUsers: [User!]!
    # 느낌표 표식은 graphQL에게 해당 필드들이 null이면 안된다고 알리는 역할
    allTweets: [Tweet!]!
    tweet(id: ID): Tweet
    movie(id: ID!): Movie
  }

  # database 수정 목적으로 쓰이는 것들을 여기에 담음
  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet!
    """
    Delete a Tweet if found, else returns false
    """
    deleteTweet(id: ID!): Boolean!
  }
  type Movie {
    id: Int!
    url: String!
    imdb_code: String!
    title: String!
    title_english: String!
    title_long: String!
    slug: String!
    year: Int!
    rating: Float!
    runtime: Float!
    genres: [String]!
    summary: String
    description_full: String!
    synopsis: String
    yt_trailer_code: String!
    language: String!
    mpa_rating: String!
    background_image: String!
    background_image_original: String!
    small_cover_image: String!
    medium_cover_image: String!
    large_cover_image: String!
  }
`;

const resolvers = {
  // Schma정의 언어와 꼭 이름이 같아야 함
  // 누군가 쿼리 타입의 tweet필드를 요청하면 이쪽으로 와서
  // 해당 함수를 호출한다.
  Query: {
    allUsers() {
      return users;
    },
    allTweets() {
      return tweets;
    },
    // apollo는 argments를 두개씩 보낸다 : root, user가 보내는 args
    // user가 args를 보낼 때,
    // 해당 args들은 항상 resolver func의 두번째 args가 된다
    tweet(root, { id }) {
      return tweets.find((tweet) => tweet.id === id);
    },
    allMovies: async () => {
      return fetch("https://yts.mx/api/v2/list_movies.json", {
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((json) => json.data.movies);
    },
    movie(_, { id }) {
      return fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((json) => json.data.movie);
    },
  },
  Mutation: {
    postTweet(_, { text, userId }) {
      const newTweet = {
        id: tweets.length + 1,
        text,
      };
      tweets.push(newTweet);
      return newTweet;
    },
    deleteTweet(_, { id }) {
      const tweet = tweets.find((tweet) => tweet.id === id);
      if (!tweet) return false;
      tweets.filter((tweet) => tweet.id !== id);
      return true;
    },
  },
  User: {
    fullName({ firstName, lastName }) {
      return `${firstName}${lastName}`;
    },
  },
  Tweet: {
    author({ userId }) {
      return users.find((user) => user.id === userId);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});
