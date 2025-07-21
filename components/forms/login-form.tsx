"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { login } from "@/app/authpages/actions";

const formSchema = z.object({
  userEmail: z.string().email(),
  password: z.string(),
});

export type LoginSchema = z.infer<typeof formSchema>;

export function LoginForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userEmail: "",
      password: "",
    },
  });

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await login(values);
      router.push("/dashboard");
    } catch (error) {
      toast.error("Login Submission Failed", {
        description: `Login Submission Error: ${error}`,
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 w-full max-w-[500px]"
      >
        <div className="flex flex-col gap-4 items-center text-center">
          <div className="w-[70px] lg:hidden">
            <Link href={"/"}>
              <img src="/ziki-logo.svg" alt="logo" />
            </Link>
          </div>
          <div className="w-full max-w-[400px] space-y-2">
            <h1 className="font-bold text-xl sm:text-2xl md:text-4xl lg:text-5xl">
              Welcome Back
            </h1>
            <p className="text-gray-500">
              Log in is simple, free and fast. One place to manage everything
              and everyone.
            </p>
          </div>
        </div>
        <FormField
          control={form.control}
          name="userEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Drake@gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="e.g. Testing@123"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <Link href={"/authpages/forgot_password"}>
            <span className="text-indigo-600 text-sm hover:underline">
              Forgot Password?
            </span>
          </Link>
        </div>
        <Button className="w-full bg-blue-500 hover:bg-sky-500" type="submit">
          Log in
        </Button>
      </form>
    </Form>
  );
}
