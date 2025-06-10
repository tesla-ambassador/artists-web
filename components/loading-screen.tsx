"use client";
import { useRef, useEffect } from "react";
import { Music, AudioLines } from "lucide-react";
import { gsap } from "gsap";

export function LoadingScreen() {
  const divRef = useRef(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    // Create a looping animation timeline
    const tl = gsap.timeline({ repeat: -1 });
    timelineRef.current = tl;

    // Main loader animation
    tl.to(divRef.current, {
      y: -15,
      duration: 1,
      ease: "power2.inOut",
    })
      .to(divRef.current, {
        y: 0,
        duration: 1,
        ease: "power2.inOut",
      })
      .to(
        divRef.current,
        {
          scale: 1,
          duration: 2,
          ease: "none",
        },
        0
      );

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
      // Kill all other animations
      gsap.killTweensOf([divRef.current]);
    };
  }, []);

  return (
    <div className="bg-white w-full h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-8 w-full max-w-[300px]">
        <div ref={divRef} className="w-20">
          <img
            src="/ziki-logo.svg"
            alt="Logo"
            className="object-cover object-center"
          />
        </div>
        <div className="w-full flex flex-col items-center">
          <div className="mx-auto">
            <AudioLines className="size-8 stroke-sky-500" />
          </div>
          <h1>Please wait while the page is loading</h1>
        </div>
      </div>
    </div>
  );
}
