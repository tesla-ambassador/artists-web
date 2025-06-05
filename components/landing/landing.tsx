"use client";

import {
  SiInstagram,
  SiTiktok,
  SiX,
  SiYoutube,
} from "@icons-pack/react-simple-icons";

import Link from "next/link";

const navLinks = [
  {
    id: 1,
    name: "About Us",
    link: "#",
  },
  {
    id: 2,
    name: "Contact Us",
    link: "#",
  },
  {
    id: 3,
    name: "Login",
    link: "/authpages/login",
  },
];

const socialMediaLinks = [
  {
    id: 1,
    icon: SiTiktok,
    link: "#",
    tag: "@zikitunez",
  },
  {
    id: 2,
    icon: SiYoutube,
    link: "#",
    tag: "@zikitunezug",
  },
  {
    id: 3,
    icon: SiX,
    link: "#",
    tag: "@zikitunezug",
  },
  {
    id: 4,
    icon: SiInstagram,
    link: "#",
    tag: "zikitunezug",
  },
];

export function Landing() {
  return (
    <div className="relative mx-auto min-h-screen h-full min-w-screen w-full overflow-hidden flex flex-col items-center gap-60 sm:gap-50 lg:gap-80">
      <div className="relative z-20 w-full mx-auto flex flex-row-reverse items-center justify-between p-4 sm:px-[50px] lg:px-[100px]">
        <div className="w-[50px] sm:w-[70px]">
          <Link href={"/"}>
            <img src="/ziki-logo.svg" alt="Ziki Tunes Logo" />
          </Link>
        </div>
        <div className="flex items-center gap-5">
          {navLinks.map((link) => (
            <Link key={link.id} href={link.link}>
              <span className="text-white hover:text-sky-500">{link.name}</span>
            </Link>
          ))}
        </div>
      </div>
      <div className="relative z-20 mx-auto flex flex-col items-center px-4">
        <h2 className="max-w-4xl text-center text-3xl font-bold text-balance text-white sm:text-6xl">
          Beyond The Beatz{" "}
          <span className="relative z-20 inline-block rounded-xl bg-gradient-to-r from-blue-500/40 to-cyan-500/40 px-4 py-1 text-white underline decoration-sky-500 decoration-[6px] underline-offset-[16px] backdrop-blur-sm">
            Ziki Tunez
          </span>{" "}
          Distribution.
        </h2>
        <p className="max-w-2xl py-8 text-center text-neutral-200 text-base">
          Let your music reach new heights through our global streaming network,
          connecting you to over 250 digital platforms. Join us and let your
          sound captivate audiences everywhere!
        </p>

        <div>
          <Link href={"authpages/signup"}>
            <button className="rounded-md bg-gradient-to-r from-blue-500/40 to-cyan-500/40 hover:from-blue-500 hover:to-cyan-500 px-6 py-2.5 text-lg font-medium text-white transition-colors focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-black focus:outline-none">
              Register
            </button>
          </Link>
        </div>

        <div className="mt-12 flex items-center gap-4">
          {socialMediaLinks.map((link) => (
            <a
              key={link.id}
              href={link.link}
              className="flex items-center gap-2 group"
            >
              <link.icon className="text-white" />
              <span className="hidden sm:inline text-gray-300 group-hover:underline">
                {link.tag}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* overlay */}
      <div className="absolute inset-0 z-10 h-full w-full bg-black/40 dark:bg-black/30" />
      <div className="pointer-events-none absolute inset-0 h-full w-full bg-[url('/landing-bg/black-musician-portrait.jpg')] sm:bg-[url('/landing-bg/black-listening-to-music.jpg')] bg-no-repeat bg-cover bg-center" />
    </div>
  );
}
