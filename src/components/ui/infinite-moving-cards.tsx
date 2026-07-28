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
  // Duplicate items 10x
  const multipliedItems = Array(10).fill(items).flat();
  
  // Split into 3 rows
  const chunkSize = Math.ceil(multipliedItems.length / 3);
  const row1 = multipliedItems.slice(0, chunkSize);
  const row2 = multipliedItems.slice(chunkSize, chunkSize * 2);
  const row3 = multipliedItems.slice(chunkSize * 2);

  // Make sure each row has items (fallback)
  const getRowItems = (row: typeof multipliedItems) => {
    if (row.length === 0) return multipliedItems;
    return row;
  };

  return (
    <div className={cn("relative z-20 w-full space-y-6", className)}>
      {/* Row 1 - Left direction */}
      <InfiniteMovingCardsRow
        items={getRowItems(row1)}
        direction="left"
        speed={speed}
        pauseOnHover={pauseOnHover}
      />

      {/* Row 2 - Right direction (opposite) */}
      <InfiniteMovingCardsRow
        items={getRowItems(row2)}
        direction="right"
        speed={speed}
        pauseOnHover={pauseOnHover}
      />

      {/* Row 3 - Left direction (opposite to row 2) */}
      <InfiniteMovingCardsRow
        items={getRowItems(row3)}
        direction="left"
        speed={speed}
        pauseOnHover={pauseOnHover}
      />
    </div>
  );
};

// Individual row component
const InfiniteMovingCardsRow = ({
  items,
  direction = "left",
  speed = "normal",
  pauseOnHover = true,
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
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    addAnimation();
  }, []);

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      // Duplicate items for infinite scroll (already multiplied, but keep for safety)
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
        containerRef.current.style.setProperty("--animation-duration", "120s");
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="scroller relative max-w-full overflow-hidden"
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-0",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item, index) => (
          <Link key={`${item.id}-${index}`} href={`/users/${item.id}`}>
            <li className="relative w-[220px] shrink-0 rounded-xs border border-zinc-700/90 bg-[#18181b] p-3 transition hover:bg-[#202023]">
              <blockquote>
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-xs bg-neutral-700 flex items-center justify-center text-xs font-semibold overflow-hidden shrink-0">
                    {item.quote ? (
                      <img
                        src={item.quote}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-sm">
                        {item.name?.[0]?.toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* User info */}
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-white truncate">
                      {item.name}
                    </span>
                    <span className="text-xs text-zinc-400 truncate">
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