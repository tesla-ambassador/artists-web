"use client";
import { VerificationForm } from "@/components/forms/verification-form";
import { Provider } from "react-redux";
import { store } from "@/store/store";

export default function VerifyOTP() {
  return (
    <Provider store={store}>
      <div className="px-10 min-h-screen h-full w-full flex items-center justify-center">
        <VerificationForm />
      </div>
    </Provider>
  );
}
