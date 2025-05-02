"use client";
import { ThreeDMarquee } from "@/components/ui/3d-marquee";
import { Button } from "../ui/button";

export function Landing() {
  const images = [
    "https://assets.aceternity.com/cloudinary_bkp/3d-card.png",
    "https://assets.aceternity.com/animated-modal.png",
    "https://assets.aceternity.com/animated-testimonials.webp",
    "https://assets.aceternity.com/cloudinary_bkp/Tooltip_luwy44.png",
    "https://assets.aceternity.com/github-globe.png",
    "https://assets.aceternity.com/glare-card.png",
    "https://assets.aceternity.com/layout-grid.png",
    "https://assets.aceternity.com/flip-text.png",
    "https://assets.aceternity.com/hero-highlight.png",
    "https://assets.aceternity.com/carousel.webp",
    "https://assets.aceternity.com/placeholders-and-vanish-input.png",
    "https://assets.aceternity.com/shooting-stars-and-stars-background.png",
    "https://assets.aceternity.com/signup-form.png",
    "https://assets.aceternity.com/cloudinary_bkp/stars_sxle3d.png",
    "https://assets.aceternity.com/spotlight-new.webp",
    "https://assets.aceternity.com/cloudinary_bkp/Spotlight_ar5jpr.png",
    "https://assets.aceternity.com/cloudinary_bkp/Parallax_Scroll_pzlatw_anfkh7.png",
    "https://assets.aceternity.com/tabs.png",
    "https://assets.aceternity.com/cloudinary_bkp/Tracing_Beam_npujte.png",
    "https://assets.aceternity.com/cloudinary_bkp/typewriter-effect.png",
    "https://assets.aceternity.com/glowing-effect.webp",
    "https://assets.aceternity.com/hover-border-gradient.png",
    "https://assets.aceternity.com/cloudinary_bkp/Infinite_Moving_Cards_evhzur.png",
    "https://assets.aceternity.com/cloudinary_bkp/Lamp_hlq3ln.png",
    "https://assets.aceternity.com/macbook-scroll.png",
    "https://assets.aceternity.com/cloudinary_bkp/Meteors_fye3ys.png",
    "https://assets.aceternity.com/cloudinary_bkp/Moving_Border_yn78lv.png",
    "https://assets.aceternity.com/multi-step-loader.png",
    "https://assets.aceternity.com/vortex.png",
    "https://assets.aceternity.com/wobble-card.png",
    "https://assets.aceternity.com/world-map.webp",
  ];
  return (
    <div className="relative mx-auto min-h-screen h-full min-w-screen w-full overflow-hidden flex flex-col items-center gap-80">
      <div className="relative z-20 w-full mx-auto flex items-center justify-between p-4 sm:px-[50px] lg:px-[100px]">
        <div className="w-[70px]">
          <img src="/ziki-logo.svg" alt="Ziki Tunes Logo" />
        </div>
        <div className="flex items-center gap-4">
          <Button className="px-7 bg-gradient-to-r from-blue-500 to-cyan-500">
            Login
          </Button>
          <Button variant={"link"} className="text-white text-lg">
            Signup
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
      <div className="pointer-events-none absolute inset-0 h-full w-full">
        <img
          src="/landing-bg/artist-bg-3.jpg"
          alt="Landing Background"
          className="object-cover object-center"
        />
      </div>
    </div>
  );
}
