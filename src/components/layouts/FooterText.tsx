"use client";

import { motion, useMotionValue, useSpring, useMotionTemplate, Variants } from "framer-motion";
import { useState } from "react";

const text = "UiSnap.Com";

const container: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const child: Variants = {
  hidden: {
    y: 100,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const SPOTLIGHT_RADIUS = 260;

export default function FooterText() {
  const [revealed, setRevealed] = useState(false); // entrance animation done?
  const [active, setActive] = useState(false);

  const mouseX = useMotionValue(-9999);
  const mouseY = useMotionValue(-9999);

  const x = useSpring(mouseX, { stiffness: 200, damping: 28 });
  const y = useSpring(mouseY, { stiffness: 200, damping: 28 });

  // Builds a live `radial-gradient(circle Rpx at Xpx Ypx, ...)` mask string
  // that framer-motion keeps in sync with the spring values, frame by frame.
  const maskImage = useMotionTemplate`radial-gradient(circle ${SPOTLIGHT_RADIUS}px at ${x}px ${y}px, black 0%, transparent 100%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!revealed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <section className="bg-black min-h-[400px] flex flex-col justify-between px-6 pt-6 pb-16 overflow-hidden">
      {/* Copyright */}
      <p className="text-white/60 text-xs ml-8">
        © 2026 UiSnap - All rights reserved.
      </p>

      {/* Animated Text */}
      <div
        className="relative flex justify-center items-center"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => revealed && setActive(true)}
        onMouseLeave={() => {
          setActive(false);
          mouseX.set(-9999);
          mouseY.set(-9999);
        }}
      >
        {/* Base layer: ghost outline text, always visible */}
        <motion.h1
          className="flex flex-wrap justify-center text-[clamp(5rem,11vw,20rem)] font-bold leading-none select-none text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.15)]"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          {text.split("").map((letter, i) => (
            <span key={i} className="inline-block overflow-hidden leading-[1.1]">
              <motion.span
                variants={child}
                className="inline-block"
                onAnimationComplete={() => {
                  if (i === text.length - 1) setRevealed(true);
                }}
              >
                {letter === " " ? "\u00A0" : letter}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        {/* Spotlight layer: solid gradient fill, revealed only inside a circle around the cursor */}
        <motion.h1
          aria-hidden
          className="pointer-events-none absolute inset-0 flex flex-wrap justify-center text-[clamp(5rem,11vw,20rem)] font-bold leading-none select-none bg-clip-text text-transparent bg-[linear-gradient(135deg,#ffffff_0%,#f97316_100%)]"
          style={{
            WebkitMaskImage: maskImage,
            maskImage,
            opacity: active ? 1 : 0,
          }}
          transition={{ opacity: { duration: 0.25 } }}
          animate={{ opacity: active ? 1 : 0 }}
        >
          {text.split("").map((letter, i) => (
            <span key={i} className="inline-block leading-[1.1]">
              {letter === " " ? "\u00A0" : letter}
            </span>
          ))}
        </motion.h1>
      </div>

      <div />
    </section>
  );
}