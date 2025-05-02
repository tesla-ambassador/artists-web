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
          <Link href={"/"}>
            <img src="/ziki-logo.svg" alt="logo" />
          </Link>
        </div>
        <div className="mt-16 text-white space-y-3">
          <h1 className="text-2xl">Why join Ziki Tunez?</h1>
          <p className="text-gray-100">
            Join a platform that gives artists the power to share their music
            with the world, grow loyal audiences, and earn from their craft. Be
            part of a movement that unlocks creative potential and transforms
            passion into sustainable success.
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
      <div className="absolute inset-0 z-10 h-full w-full bg-blue-400/65" />
    </div>
  );
}
