"use client";
import React from "react";
import { Landing } from "@/components/landing/landing";
import { Provider } from "react-redux";
import { store } from "@/store/store";

export default function Home() {
  return (
    <Provider store={store}>
      <Landing />
    </Provider>
  );
}
