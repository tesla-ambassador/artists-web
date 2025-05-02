import React from "react";

export default function ArchiveTabContent({
  children,
  title,
  desc,
}: {
  children: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="mt-16">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl text-blue-500">{title}</h1>
        <p className="font-gray-500">{desc}</p>
      </div>
      <div>{children}</div>
    </div>
  );
}

export function SongsTabContent() {
  return <div></div>;
}
