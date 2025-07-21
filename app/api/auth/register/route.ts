// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase";
import { prisma } from "../../../../lib/db"; // Adjust path as needed
import validator from "validator";

const validatePassword = (password: string): boolean => {
  // At least one lowercase letter, one uppercase letter, one number, and one special character
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
  return passwordRegex.test(password);
};

export async function POST(request: NextRequest) {
  console.log("API route called");
  try {
    const body = await request.json();
    console.log("Request body:", body);
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
    } = body;

    // Validate required fields
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Name, Email, and Password are required." },
        { status: 400 }
      );
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return NextResponse.json(
        { error: `Email address "${email}" is invalid.` },
        { status: 400 }
      );
    }

    // Validate password complexity
    if (!validatePassword(password)) {
      return NextResponse.json(
        {
          error:
            "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character.",
        },
        { status: 400 }
      );
    }

    // Check if user already exists in Prisma
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "User already exists." },
        { status: 400 }
      );
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
      return NextResponse.json({ error: error.message }, { status: 400 });
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
        followers: followers || 0,
        monthly_plays: monthly_plays || 0,
        downloads: downloads || 0,
        is_artist: is_artist || false,
        country,
        email_alerts: email_alerts !== undefined ? email_alerts : true,
        instagram,
        twitter,
        youtube,
        facebook,
        role: role || "user",
        influencers: influencers || [],
        genre: genre || [],
      },
    });

    return NextResponse.json(
      {
        message: "Signup successful. Check your email for verification.",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          // Include other non-sensitive fields you want to return
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error during registration" },
      { status: 500 }
    );
  }
}
