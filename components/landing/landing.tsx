"use client";
import { ThreeDMarquee } from "@/components/ui/3d-marquee";
import { Button } from "../ui/button";
import Link from "next/link";

export function Landing() {
  return (
    <div className="relative mx-auto min-h-screen h-full min-w-screen w-full overflow-hidden flex flex-col items-center gap-80">
      <div className="relative z-20 w-full mx-auto flex items-center justify-between p-4 sm:px-[50px] lg:px-[100px]">
        <div className="w-[50px] sm:w-[70px]">
          <img src="/ziki-logo.svg" alt="Ziki Tunes Logo" />
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <Button className="sm:px-7 bg-gradient-to-r from-blue-500 to-cyan-500">
            <Link href={"/authpages/login"}>Login</Link>
          </Button>
          <Button variant={"link"} className="text-white sm:text-lg">
            <Link href={"/authpages/signup"}>Signup</Link>
          </Button>
        </div>
      </div>
      <div className="relative z-20 mx-auto flex flex-col items-center">
        <h2 className="max-w-4xl text-center text-2xl font-bold text-balance text-white md:text-4xl lg:text-6xl">
          Beyond The Beatz{" "}
          <span className="relative z-20 inline-block rounded-xl bg-gradient-to-r from-blue-500/40 to-cyan-500/40 px-4 py-1 text-white underline decoration-sky-500 decoration-[6px] underline-offset-[16px] backdrop-blur-sm">
            Ziki Tunez
          </span>{" "}
          Distribution.
        </h2>
        <p className="max-w-2xl py-8 text-center text-sm text-neutral-200 md:text-base">
          Let your music reach new heights through our global streaming network,
          connecting you to over 250 digital platforms. Join us and let your
          sound captivate audiences everywhere!
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button className="rounded-md bg-gradient-to-r from-blue-500/40 to-cyan-500/40 hover:from-blue-500 hover:to-cyan-500 px-6 py-2.5 text-sm font-medium text-white transition-colors focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-black focus:outline-none">
            Join Us
          </button>
          <button className="rounded-md border border-white/20 bg-white/10 px-6 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-black focus:outline-none">
            About Us
          </button>
        </div>
      </div>

      {/* overlay */}
      <div className="absolute inset-0 z-10 h-full w-full bg-black/50 dark:bg-black/40" />
      <div className="pointer-events-none absolute inset-0 h-full w-full bg-[url('/landing-bg/artist-bg-3.jpg')] bg-no-repeat bg-cover bg-center" />
    </div>
  );
}
