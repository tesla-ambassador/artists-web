"use client";
import { SignupForm } from "@/components/forms/signup-form";
import { Provider } from "react-redux";
import { store } from "@/store/store";

export default function SignUp() {
  return (
    <Provider store={store}>
      <div className="px-10 min-h-screen h-full w-full flex items-center justify-center">
        <SignupForm />
      </div>
    </Provider>
  );
}
