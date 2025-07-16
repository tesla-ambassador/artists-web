const asyncHandler = require("express-async-handler");
const supabase = require("../lib/supabaseClient");
const { prisma } = require("../lib/db");

const verifyToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401);
    throw new Error("Authorization token missing or malformed.");
  }

  const token = authHeader.split(" ")[1];

  // Validate token using Supabase
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data?.user) {
    res.status(401);
    throw new Error("Invalid or expired token.");
  }

  const supabaseUserId = data.user.id;

  // Find Prisma user by supabaseUserId
  const user = await prisma.user.findUnique({
    where: { supabaseUserId },
  });

  if (!user) {
    res.status(401);
    throw new Error("User not found in local database.");
  }

  // Attach Prisma user's UUID id to req.user.id
  req.user = {
    id: user.id,
    email: user.email,
  };

  next();
});

module.exports = verifyToken;
