"use client";
import { Suspense } from "react";
import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";
import { Provider } from "react-redux";
import { store } from "@/store/store";

export default function VerifyOTP() {
  return (
    <Suspense>
      <Provider store={store}>
        <div className="px-10 min-h-screen h-full w-full flex items-center justify-center">
          <ForgotPasswordForm />
        </div>
      </Provider>
    </Suspense>
  );
}
