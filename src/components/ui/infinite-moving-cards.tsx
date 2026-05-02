"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: {
    quote: string;
    name: string;
    title: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  useEffect(() => {
    addAnimation();
  }, []);
  const [start, setStart] = useState(false);
  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }
  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards"
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse"
        );
      }
    }
  };
  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
    }
  };
  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20  max-w-7xl overflow-hidden  [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          " flex min-w-full shrink-0 gap-4 py-4 w-max flex-nowrap",
          start && "animate-scroll ",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item, idx) => (
          <li
            className="w-[350px] max-w-full relative rounded-3xl border border-white/5 flex-shrink-0 px-8 py-8 md:w-[450px] bg-[#0a0a0a] overflow-hidden group transition-all duration-500 hover:border-primary/20"
            key={item.name}
          >
            {/* Noise Texture */}
            <div className="absolute inset-0 bg-noise pointer-events-none" />
            
            {/* Quote Icon */}
            <div className="absolute top-6 right-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-primary">
                <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C20.1216 16 21.017 16.8954 21.017 18V21C21.017 22.1046 20.1216 23 19.017 23H16.017C14.9124 23 14.017 22.1046 14.017 21Z" />
                <path d="M3.01703 21L3.01703 18C3.01703 16.8954 3.91246 16 5.01703 16H8.01703C9.1216 16 10.017 16.8954 10.017 18V21C10.017 22.1046 9.1216 23 8.01703 23H5.01703C3.91246 23 3.01703 22.1046 3.01703 21Z" />
                <path d="M10.017 10C10.017 4.47715 14.4942 0 20.017 0V4C16.7033 4 14.017 6.68629 14.017 10H20.017V16H14.017V10H10.017Z" />
                <path d="M0.0170288 10C0.0170288 4.47715 4.49418 0 10.017 0V4C6.70332 4 4.01703 6.68629 4.01703 10H10.017V16H4.01703V10H0.0170288Z" />
              </svg>
            </div>

            <blockquote className="relative z-10">
              <span className="relative z-20 text-lg md:text-xl leading-[1.6] text-white/90 font-serif italic mb-8 block">
                "{item.quote}"
              </span>
              <div className="relative z-20 mt-8 flex flex-row items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
                  {item.name.charAt(0)}
                </div>
                <span className="flex flex-col gap-0.5">
                  <span className="text-sm leading-[1.6] text-white font-bold tracking-tight">
                    {item.name}
                  </span>
                  <span className="text-[10px] leading-[1.6] text-primary font-black uppercase tracking-[0.2em]">
                    {item.title}
                  </span>
                </span>
              </div>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
};
