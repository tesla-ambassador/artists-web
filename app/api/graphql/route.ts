import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { NextRequest } from "next/server";
import { typeDefs } from "@/graphql/typeDefs";
import { resolvers } from "@/graphql/resolver";
import { createContext } from "@/graphql/context";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: process.env.NODE_ENV !== "production",
});

const handler = startServerAndCreateNextHandler(server, {
  context: async (req: NextRequest) => await createContext(req),
});

export { handler as GET, handler as POST };
