"use client";
import React from "react";
import { Archive } from "./Archive";
import { Provider } from "react-redux";
import { store } from "@/store/store";

export default function page() {
  return (
    <Provider store={store}>
      <div className="min-h-screen px-4 sm:px-[50px] py-8">
        <Archive />
      </div>
    </Provider>
  );
}
