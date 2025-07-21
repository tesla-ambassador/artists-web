"use client";

import React, { use } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
  FormDescription,
} from "../ui/form";

import { Input } from "../ui/input";
import {
  InputOTP,
  InputOTPSlot,
  InputOTPGroup,
  InputOTPSeparator,
} from "../ui/input-otp";
import { fallbackModeToFallbackField } from "next/dist/lib/fallback";
import { Button } from "../ui/button";

const formSchema = z
  .object({
    OTP: z.string().min(6, { message: "OTP must be atlease 6 characters." }),
    password: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

export function ResetPasswordForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
      OTP: "",
    },
  });

  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPasswordReset, setIsPasswordReset] = React.useState<{
    status: "error" | "success";
    message: string;
  }>();
  const [counter, setCounter] = React.useState(59);

  const email = searchParams.get("email");

  React.useEffect(() => {
    if (email === null) {
      // router.push("/");
      console.log("deeze nutz");
    }
    console.log(email);
  }, [useSearchParams]);

  React.useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (counter > 0) {
      timer = setInterval(
        () => setCounter((prevCounter: number) => prevCounter - 1),
        1000
      );
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [counter]);

  const handleResend = async () => {
    if (email === null) return;
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
      });

      if (error) {
        toast.error("Failed to Resend OTP", {
          description: `OTP Resend Error: ${error.message}`,
        });
      } else {
        toast.success("OTP sent to email", {
          description: "Open your email to receive OTP.",
        });
      }
    } catch (err) {
      toast.error("OTP Request failed", {
        description: `OTP Request Submission Error: ${err}`,
      });
    }
  };

  const handleResetPassword = async (otp: string, newPassword: string) => {
    // Verify OTP
    if (email === null) return;
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email: email,
      token: otp,
      type: "email",
    });

    if (verifyError) {
      toast.error("Unable To Verify OTP", {
        description: `OTP Verification Error: ${verifyError.message}`,
      });
      return;
    }

    // Update the password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      toast.error("Unable to update password", {
        description: `Error updating password: ${updateError.message}`,
      });
    } else {
      toast.success("Password Updated Successfully", {
        description: "Your password has successfully been updated",
      });
      router.push("login");
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { OTP, password } = values;
    await handleResetPassword(OTP, password);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="w-full max-w-[400px] space-y-2">
          <h1 className="font-semibold text-xl sm:text-2xl md:text-4xl lg:text-5xl">
            Reset Your Password.
          </h1>
          <p className="text-gray-500">
            {email !== null
              ? `Please input the OTP sent to ${email}.`
              : `Please input the OTP sent to your email.`}
          </p>
        </div>
        <FormField
          name="OTP"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>OTP</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription className="sr-only">
                Please input the OTP sent to your email
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormDescription className="sr-only">
                Please input your new password
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="confirmPassword"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormDescription className="sr-only">
                Please confirm your new password
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full bg-blue-500 hover:bg-sky-500" type="submit">
          Submit
        </Button>
        {counter !== 0 ? (
          <p className="text-sm text-center mt-2">
            Resend OTP in{" "}
            <span className="font-semibold text-blue-500">00:{counter}</span>
          </p>
        ) : (
          <Button
            className="w-full text-blue-500 hover:text-sky-500"
            type="button"
            variant={"link"}
            onClick={handleResend}
          >
            Resend OTP
          </Button>
        )}
      </form>
    </Form>
  );
}
