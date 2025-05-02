import {
  IconBrandTiktok,
  IconBrandX,
  IconBrandInstagram,
  IconBrandYoutube,
} from "@tabler/icons-react";
import Link from "next/link";
import { ForwardRefExoticComponent, RefAttributes } from "react";

const links = [
  { id: 1, url: "#", icon: IconBrandX },
  { id: 2, url: "#", icon: IconBrandTiktok },
  { id: 3, url: "#", icon: IconBrandInstagram },
  { id: 4, url: "#", icon: IconBrandYoutube },
];

export function AuthSidebar() {
  return (
    <div className="relative h-full w-full flex flex-col justify-between p-4 pb-20 bg-[url('/landing-bg/drums-potrait.jpg')] bg-no-repeat bg-center bg-cover">
      <div className="relative z-20">
        <div className="w-[70px]">
          <img src="/ziki-logo.svg" alt="logo" />
        </div>
        <div className="mt-16 text-white space-y-3">
          <h1 className="text-xl">Sign up and come on in</h1>
          <p className="text-gray-200">
            Sign up is simple, free and fast. One place to manage everything and
            everyone.
          </p>
        </div>
      </div>
      <div className="relative z-20">
        <div className="flex gap-2 items-center">
          {links.map((item) => (
            <div key={item.id}>
              <Link href={item.url}>
                <item.icon className="text-white" />
              </Link>
            </div>
          ))}
        </div>
      </div>
      {/* Overlay */}
      <div className="absolute inset-0 z-10 h-full w-full bg-black/65 dark:bg-black/50" />
    </div>
  );
}
