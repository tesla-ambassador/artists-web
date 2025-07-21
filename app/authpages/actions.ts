"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { SignUpSchema } from "@/components/forms/signup-form";
import { LoginSchema } from "@/components/forms/login-form";
import { toast } from "sonner";

import { createClient } from "@/utils/supabase/server";

export async function login(formData: LoginSchema) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.userEmail,
    password: formData.password,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    toast.error("Login Failed", {
      description: `Login Error: ${error}`,
    });
  }

  //   revalidatePath("/", "layout");
  //   redirect("/");
}

export async function signup(formData: SignUpSchema) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.email,
    password: formData.password,
    phone: formData.phone,
    displayName: formData.fullName,
  };

  const { error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    phone: formData.phone,
    options: {
      data: {
        display_name: formData.fullName,
        phone: formData.phone,
      },
    },
  });

  if (error) {
    toast.error("Sign Up Failed", {
      description: `Sign Up Error: ${error}`,
    });
  }
  //   revalidatePath("/dashboard", "layout");
  //   redirect("/dashboard");
}

export const verifyOTP = async (email: string, token: string) => {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email", // or 'signup' if it's for initial signup confirmation
    });

    if (error) {
      console.error("OTP verification failed:", error.message);
      return { success: false, error: error.message };
    }

    console.log("User verified successfully:", data);
    return { success: true, data };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { success: false, error: "An unexpected error occurred" };
  }
};

// const setNewView = async () => {
//           const { data, error } = await supabase.from("views").insert({
//             fullName: values.fullName,
//             stageName: values.stageName,
//             email: values.email,
//             phone: values.phone,
//             country: values.country,
//             password: values.password,
//             agreeTerms: values.agreeToTerms,
//           });

//           if (data) {
//             console.log(data);
//             setIsLoading(false);
//           }
//           if (error) console.log(error);
//         };
//         setNewView();
