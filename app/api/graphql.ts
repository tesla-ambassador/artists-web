import { ApolloServer } from "apollo-server-micro";
import { typeDefs } from "../../graphql/typeDefs";
import { resolvers } from "../../graphql/resolvers";
import { createContext } from "../../graphql/context";
import { NextApiRequest, NextApiResponse } from "next";

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: createContext,
  introspection: true,
});

const startServer = apolloServer.start();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control",
  );
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");

  if (req.method === "OPTIONS") {
    res.end();
    return false;
  }

  await startServer;
  await apolloServer.createHandler({ path: "/api/graphql" })(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
