require("dotenv").config();
import http from "http";
import express from "express";
import logger from "morgan";
import { ApolloServer } from "apollo-server-express";
import { typeDefs, resolvers } from "./schema";
import { getUser } from "./users/users.utils";
import pubsub from "./pubSub";

const PORT = process.env.PORT;
const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    // 실시간 protocol인 ws(websocket)의 경우 request가 없으므로 에러가 발생: 조건문 처리
    if (req) {
      return {
        loggedInUser: await getUser(req.headers.token),
      };
    }
  },
});

const app = express();
app.use(logger("tiny"));
apollo.applyMiddleware({ app });
app.use("/static", express.static("uploads"));

// http server를 apollo-server-express로 만든 후 아폴로 subscription에 httpServer 추가
const httpServer = http.createServer(app);
apollo.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}/graphql`)
);
