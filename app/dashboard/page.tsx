"use client";

import React from "react";
import DashboardContent from "./Content";
import { Provider } from "react-redux";
import { store } from "@/store/store";

export default function Dashboard() {
  return (
    <Provider store={store}>
      <div className="min-h-screen px-4 sm:px-[50px] py-8">
        <DashboardContent />
      </div>
    </Provider>
  );
}
