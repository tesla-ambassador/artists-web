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

  if (!validator.isEmail(email)) {
    res.status(400);
    throw new Error(`Email address "${email}" is invalid.`);
  }

  if (!validatePassword(password)) {
    res.status(400);
    throw new Error(
      "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character."
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.status(400);
    throw new Error("User already exists.");
  }

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

  const supabaseUserId = data.user.id;

  // Create user in Prisma with the Supabase user ID and other data
  const user = await prisma.user.create({
    data: {
      supabaseUserId,
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

// LOGIN A USER (with Prisma sync if user missing)
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required.");
  }

  // Authenticate via Supabase
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    res.status(401);
    throw new Error("Invalid credentials.");
  }

  const supabaseUserId = data.user.id;

  // Try to find user by supabaseUserId in Prisma DB
  let user = await prisma.user.findUnique({
    where: { supabaseUserId },
  });

  if (!user) {
    // User exists in Supabase but not in Prisma, create user in Prisma
    user = await prisma.user.create({
      data: {
        supabaseUserId,
        email: data.user.email,
        name: data.user.user_metadata?.name || null,
        // optionally add more fields here from user_metadata or defaults
      },
    });
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

// FORGOT PASSWORD
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("Email is required.");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: process.env.FRONTEND_RESET_PASSWORD_URL,
  });

  if (error) {
    res.status(400);
    throw new Error(error.message);
  }

  res.status(200).json({
    message: "Password reset email sent. Please check your inbox.",
  });
});

// DELETE CURRENT USER ACCOUNT
const deleteAccount = asyncHandler(async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401);
    throw new Error("Unauthorized. User ID not found.");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    res.status(404);
    throw new Error("User not found.");
  }

  // Delete from Supabase Auth using supabaseUserId stored in Prisma
  const supabaseUserId = user.supabaseUserId;
  const { error: supaError } = await supabase.auth.admin.deleteUser(supabaseUserId);

  if (supaError) {
    res.status(500);
    throw new Error(`Failed to delete user from Supabase: ${supaError.message}`);
  }

  // Delete from Prisma
  await prisma.user.delete({
    where: { id: userId },
  });

  res.status(200).json({ message: "User account deleted successfully." });
});

module.exports = {
  registerUser,
  loginUser,
  currentUser,
  forgotPassword,
  deleteAccount,
};
