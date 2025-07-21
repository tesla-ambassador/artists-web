import { VerificationForm } from "@/components/forms/verification-form";
import { Suspense } from "react";

export default function VerifyOTP() {
  return (
    <Suspense>
      <div className="px-10 min-h-screen h-full w-full flex items-center justify-center">
        <VerificationForm />
      </div>
    </Suspense>
  );
}
