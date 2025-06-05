"use client";
import { LoginForm } from "@/components/forms/login-form";
import { Provider } from "react-redux";
import { store } from "@/store/store";

export default function Login() {
  return (
    <Provider store={store}>
      <div className="px-10 min-h-screen h-full w-full flex items-center justify-center">
        <LoginForm />
      </div>
    </Provider>
  );
}
