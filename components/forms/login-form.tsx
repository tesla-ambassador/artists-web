"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

const formSchema = z.object({
  stageName: z.string(),
  password: z.string(),
});

export function LoginForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      stageName: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 w-full max-w-[500px]"
      >
        <div className="flex flex-col gap-4 items-center text-center lg:hidden">
          <div className="w-[70px]">
            <img src="/ziki-logo.svg" alt="logo" />
          </div>
          <div className="w-full max-w-[400px]">
            <h1 className="font-semibold text-xl sm:text-2xl">Welcome Back</h1>
            <p>
              Log in is simple, free and fast. One place to manage everything
              and everyone.
            </p>
          </div>
        </div>
        <FormField
          control={form.control}
          name="stageName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stage Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Drake" {...field} />
              </FormControl>
              <FormDescription>This is your artist name.</FormDescription>
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
          <Link href={"#"}>
            <span className="text-indigo-600 text-sm hover:underline">
              Forgot Password?
            </span>
          </Link>
        </div>
        <Button className="w-full" type="submit">
          Log in
        </Button>
      </form>
    </Form>
  );
}
