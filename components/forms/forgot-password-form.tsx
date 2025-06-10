"use client";
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import usePasswordReset from "@/hooks/usePasswordReset";
import { useRouter } from "next/navigation";

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
  const { isLoading, isSuccess, error, sendEmail } = usePasswordReset();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const userEmail = form.watch("email");

  React.useEffect(() => {
    if (isSuccess) {
      router.push(`/authpages/reset_password?useremail=${userEmail}`);
    }
  }, [isSuccess]);

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    console.log(value);
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
