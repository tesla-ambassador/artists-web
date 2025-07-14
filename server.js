const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const dotenv = require("dotenv").config();
const errorHandler = require("./middleware/errorHandler");
const typeDefs = require("./graphql/typeDefs.js");
const resolvers = require("./graphql/resolvers.js");
const { createClient } = require("@supabase/supabase-js");
const supabase = require("./lib/supabaseClient");


const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

// REST routes
app.use("/api/Users", require("./routes/userRoutes"));

// Error handler
app.use(errorHandler);

// Extract and validate JWT from Authorization header
const getUserFromAuthHeader = async (req) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];

  if (!token) return null;

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data?.user) {
    console.error("Supabase auth error:", error?.message);
    return null;
  }

  return data.user;
};


// Start Apollo GraphQL Server
async function startGraphQL() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      const user = await getUserFromAuthHeader(req);
      if (user) console.log("Authenticated user:", user.email);
      return { user };
    },
  });

  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`GraphQL available at http://localhost:${port}/graphql`);
  });
}

startGraphQL();
