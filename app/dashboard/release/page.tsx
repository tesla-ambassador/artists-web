import React from "react";
import {
  ReleaseHeader,
  ReleaseBody,
} from "@/components/releases/release-header";

export default function Releases() {
  return (
    <div className="min-h-screen px-4 sm:px-[50px] py-8">
      <ReleaseHeader />
      <ReleaseBody />
    </div>
  );
}
