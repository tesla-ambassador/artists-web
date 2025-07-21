"use client";
import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/forms/reset-password-form";

export default function VerifyOTP() {
  return (
    <Suspense>
      <div className="px-10 min-h-screen h-full w-full flex items-center justify-center">
        <ResetPasswordForm />
      </div>
    </Suspense>
  );
}
