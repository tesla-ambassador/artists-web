const asyncHandler = require("express-async-handler");
const { prisma } = require("../lib/db");
const supabase = require("../lib/supabaseClient");
const validator = require("validator");

// Password validation function
function validatePassword(password) {
  const lowercase = /[a-z]/;
  const uppercase = /[A-Z]/;
  const digit = /\d/;
  const specialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|<>?,./`~]/;

  return (
    lowercase.test(password) &&
    uppercase.test(password) &&
    digit.test(password) &&
    specialChar.test(password)
  );
}

// REGISTER A USER
const registerUser = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    nickname,
    locale,
    preferred_username,
    bio,
    based_country,
    based_region,
    address,
    website,
    picture,
    followers,
    monthly_plays,
    downloads,
    is_artist,
    country,
    email_alerts,
    instagram,
    twitter,
    youtube,
    facebook,
    role,
    influencers,
    genre,
  } = req.body;

  if (!email || !password || !name) {
    res.status(400);
    throw new Error("Name, Email, and Password are required.");
  }

  // Validate email format
  if (!validator.isEmail(email)) {
    res.status(400);
    throw new Error(`Email address "${email}" is invalid.`);
  }

  // Validate password complexity before signing up
  if (!validatePassword(password)) {
    res.status(400);
    throw new Error(
      "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character."
    );
  }

  // Check if user already exists in Prisma
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.status(400);
    throw new Error("User already exists.");
  }

  // Register with Supabase
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  });

  if (error) {
    res.status(400);
    throw new Error(error.message);
  }

  // Store extended user profile in your local Prisma DB
  const user = await prisma.user.create({
    data: {
      name,
      email,
      nickname,
      locale,
      preferred_username,
      bio,
      based_country,
      based_region,
      address,
      website,
      updated_at: new Date(),
      picture,
      followers,
      monthly_plays,
      downloads,
      is_artist,
      country,
      email_alerts,
      instagram,
      twitter,
      youtube,
      facebook,
      role,
      influencers,
      genre,
    },
  });

  res.status(201).json({
    message: "Signup successful. Check your email for verification.",
    user,
  });
});

// LOGIN A USER
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required.");
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    res.status(401);
    throw new Error("Invalid credentials.");
  }

  // Get user data from your Prisma DB
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.status(404);
    throw new Error("User found in Supabase but not in local database.");
  }

  res.status(200).json({
    message: "Login successful.",
    token: data.session.access_token,
    user,
  });
});

// GET CURRENT USER
const currentUser = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  if (!user) {
    res.status(404);
    throw new Error("User not found.");
  }

  res.status(200).json(user);
});

module.exports = {
  registerUser,
  loginUser,
  currentUser,
};
