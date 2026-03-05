"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import Link from "next/link";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: {
  id: string;
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
          "forwards",
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse",
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
        "scroller relative z-20 max-w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className,
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-4",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]",
        )}
      >
       {items.map((item) => (
  <Link key={item.id} href={`/users/${item.id}`}>
    <li
      className="relative w-fit shrink-0 rounded-lg border px-3 py-2 border-zinc-700 bg-[#1b1b1b]  transition"
    >
      <blockquote>

        <div className="flex items-center gap-3">

          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center text-xs font-semibold overflow-hidden">
            {item.quote ? (
              <img
                src={item.quote}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            ) : (
              item.name?.[0]?.toUpperCase()
            )}
          </div>

          {/* User info */}
          <div className="flex flex-col leading-tight">
            <span className="text-xs font-medium text-white">
              {item.name}
            </span>

            <span className="text-[11px] text-neutral-400">
              {item.title}
            </span>
          </div>

        </div>

      </blockquote>
    </li>
  </Link>
))}
      </ul>
    </div>
  );
};
