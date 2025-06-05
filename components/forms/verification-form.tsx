"use client";
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import useOTPVerification from "@/hooks/useOTPVerification";
import useAuth from "@/hooks/useAuth";

const formSchema = z.object({
  OTP: z.string().min(6, {
    message: "Your OTP must be 6 characters",
  }),
});

import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "../ui/form";

import {
  InputOTP,
  InputOTPSlot,
  InputOTPGroup,
  InputOTPSeparator,
} from "../ui/input-otp";

import { Button } from "../ui/button";

export function VerificationForm() {
  const initialStatus = {
    error: false,
    success: false,
    message: "",
  };
  const [status, setStatus] = React.useState(initialStatus);
  const router = useRouter();
  const searchParams = useSearchParams();

  const { sendOTPStatus, sendOTP, verifyOTP, verifyOTPStatus } =
    useOTPVerification();

  const { isLoading, error, signIn } = useAuth();
  const [counter, setCounter] = React.useState(59); // 60 Seconds Counter
  const [shouldLogin, setShouldLogin] = React.useState(true); // 60 Seconds Counter
  const email = searchParams.get("email");
  const password = searchParams.get("password");
  const userName = searchParams.get("username");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      OTP: "",
    },
  });

  React.useEffect(() => {
    if (password === null || userName === null) {
      setShouldLogin(false);
    }
  }, [searchParams]);

  React.useEffect(() => {
    if (sendOTPStatus.error || verifyOTPStatus.error || error) {
      setStatus({
        success: false,
        error: true,
        message: sendOTPStatus?.error || verifyOTPStatus?.error || error,
      });
    }
  }, [sendOTPStatus.error, verifyOTPStatus.error, error]);

  const login = async () => {
    if (email !== null && password !== null) {
      try {
        await signIn(email, password);
        router.push("/");
      } catch (err: any) {
        console.log(err);
        setStatus({
          error: true,
          success: false,
          message: err.message as string,
        });
      }
    } else {
      console.log("Email and Password aren't defined.");
    }
  };

  React.useEffect(() => {
    if (verifyOTPStatus.isSuccess) {
      if (shouldLogin) {
        login();
        setStatus(initialStatus);
      } else {
        setStatus({
          error: false,
          success: true,
          message: "Account verified successfully! Redirecting you to login.",
        });
        setTimeout(() => {
          router.push("/authpages/login");
        }, 3000);
      }
    }

    sendOTPStatus.isSuccess &&
      setStatus({
        error: false,
        success: true,
        message: "OTP has been sent successfully!",
      });
  }, [verifyOTPStatus.isSuccess, sendOTPStatus.isSuccess]);

  React.useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (counter > 0) {
      timer = setInterval(
        () => setCounter((prevCounter: number) => prevCounter - 1),
        1000,
      );
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [counter]);

  const resendOTP = async () => {
    if (email !== null) {
      await sendOTP(email);
      setCounter(59);
    } else {
      console.log("The email isn't defined.");
    }
  };

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    console.log(value);
    if (userName !== null && email !== null) {
      if (shouldLogin) {
        await verifyOTP(userName, value.OTP);
      } else {
        await verifyOTP(email, value.OTP);
      }
    } else {
      console.log("Your email and username haven't been recieved.");
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="w-full max-w-[400px] space-y-2">
          <h1 className="font-semibold text-xl sm:text-2xl md:text-4xl lg:text-5xl">
            Verify with OTP
          </h1>
          <p className="text-gray-500">
            Please input the OTP sent to your mobile phone.
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
              <FormMessage />
              <FormDescription className="sr-only">
                Please input the OTP sent to your mobile phone.
              </FormDescription>
            </FormItem>
          )}
        />
        <Button className="w-full bg-blue-500 hover:bg-sky-500" type="submit">
          {sendOTPStatus.isLoading || verifyOTPStatus.isLoading || isLoading
            ? "Loading..."
            : "Submit"}
        </Button>
        {counter !== 0 ? (
          <p className="text-sm text-center mt-2">
            Resend OTP in{" "}
            <span className="font-semibold text-blue-500">00:{counter}</span>
          </p>
        ) : (
          <Button
            className="w-full text-blue-500 hover:text-sky-500"
            onClick={resendOTP}
            type="button"
            variant={"link"}
          >
            Resend OTP
          </Button>
        )}
      </form>
    </Form>
  );
}
