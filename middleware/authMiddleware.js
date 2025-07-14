const asyncHandler = require("express-async-handler");
const supabase = require("../lib/supabaseClient");

const verifyToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401);
    throw new Error("No token provided.");
  }

  const token = authHeader.split(" ")[1];

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data?.user) {
    res.status(401);
    throw new Error("Invalid or expired token.");
  }

  // Attach user object to request
  req.user = {
    id: data.user.id,
    email: data.user.email,
  };

  next();
});

module.exports = verifyToken;
