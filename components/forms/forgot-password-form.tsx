"use client";
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormMessage,
  FormDescription,
  FormLabel,
} from "../ui/form";

import { Input } from "../ui/input";
import { Button } from "../ui/button";

const formSchema = z.object({
  email: z.string().email(),
});

export function ForgotPasswordForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const userEmail = form.watch("email");

  const handlePasswordReset = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      toast.error("Password Reset Failed", {
        description: `Error resetting password: ${error.message}`,
      });
    } else {
      toast.success("Password Reset Successful", {
        description:
          "You will recieve an email with an OTP to reset your password",
      });
    }
  };

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    try {
      await handlePasswordReset(value.email);
      router.push(`reset_password?email=${value.email}`);
    } catch (error) {
      toast.error("Form Submission Unsuccessful", {
        description: `Error submitting form: ${error}`,
      });
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="w-full max-w-[400px] space-y-2">
          <h1 className="font-semibold text-xl sm:text-2xl md:text-4xl lg:text-5xl">
            Forgot Password
          </h1>
          <p className="text-gray-500">
            Please enter your email and we will send you an OTP
          </p>
        </div>
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="e.g drake@gmail.com" {...field} />
              </FormControl>
              <FormDescription className="sr-only">
                Please enter your email and we will send you an OTP
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full bg-blue-500 hover:bg-sky-500" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}
