"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoadingScreen } from "../loading-screen";
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
import { Checkbox } from "../ui/checkbox";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectGroup,
  SelectValue,
  SelectContent,
} from "../ui/select";

import { countryPhoneCodes, extractPhoneCode } from "@/data/country-code-data";
import { signup } from "@/app/authpages/actions";

// Enhanced validation schema with password complexity
const formSchema = z
  .object({
    fullName: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    stageName: z.string(),
    email: z.string().email(),
    phone: z.string().nonempty({ message: "Please provide a phone number" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        {
          message:
            "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
        }
      ),
    confirmPassword: z.string(),
    country: z.string().nonempty({ message: "Please select a country" }),
    agreeToTerms: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignUpSchema = z.infer<typeof formSchema>;

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      stageName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      country: "",
      agreeToTerms: false,
    },
  });
  const watchTerms = form.watch("agreeToTerms");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      await signup(values);
      router.push(`verify?email=${values.email}`);
    } catch (error) {
      setIsLoading(false);
      toast.error("Sorry couldn't sign you up.", {
        description: `Error: ${error}`,
      });
    }
  };

  // Show loading screen while processing
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 w-full max-w-[500px]"
      >
        <div className="flex flex-col gap-4 items-center text-center lg:hidden">
          <div className="w-[70px]">
            <Link href={"/"}>
              <img src="/ziki-logo.svg" alt="logo" />
            </Link>
          </div>
          <div className="w-full max-w-[400px]">
            <h1 className="font-semibold text-xl sm:text-2xl">Sign Up</h1>
            <p>
              Sign up is simple, free and fast. One place to manage everything
              and everyone.
            </p>
          </div>
        </div>

        {/* Show error message if any */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Aubrey Graham" {...field} />
              </FormControl>
              <FormDescription>
                This is your official government name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="e.g. luffy@gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-3 items-center w-full">
          <FormField
            name="country"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Country</FormLabel>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Your Country" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent side="bottom" sticky="always">
                    <SelectGroup>
                      {countryPhoneCodes.map((item) => (
                        <SelectItem
                          key={`${item.code}-${item.country}`}
                          value={`${item.code}-${item.country}`}
                        >
                          {item.country}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="e.g 0712345678" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-between gap-4 w-full">
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
                <FormDescription className="text-xs">
                  Must contain uppercase, lowercase, number, and special
                  character
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="agreeToTerms"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="items-top flex space-x-2">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    id="terms1"
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="terms1"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Accept terms and conditions
                    </label>
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          disabled={!watchTerms || isLoading}
          className="w-full"
          type="submit"
        >
          {isLoading ? "Creating Account..." : "Sign Up"}
        </Button>
      </form>
    </Form>
  );
}
