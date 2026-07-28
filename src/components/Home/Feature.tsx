"use client";

import { Aperture, Film, MonitorPlay, Palette, Waves } from "lucide-react";
import { GlowingEffect } from "@/components/Home/GlowingEffect";
import { cn } from "@/lib/utils";

const CAPABILITIES: GridItemProps[] = [
  {
    area: "md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]",
    icon: <Aperture className="h-4 w-4" />,
    index: "01",
    title: "Brand & Identity",
    description:
      "Marks, systems, and world-building for names that need to be remembered before they're read.",
  },
  {
    area: "md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]",
    icon: <Film className="h-4 w-4" />,
    index: "02",
    title: "Film & Motion",
    description:
      "Cinematography and edit built for the frame it will actually be watched in — feed, screen, or theatre.",
  },
  {
    area: "md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]",
    icon: <Palette className="h-4 w-4" />,
    index: "03",
    title: "Art Direction",
    description:
      "A single visual language held across every touchpoint, from set design to the smallest social crop.",
  },
  {
    area: "md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]",
    icon: <MonitorPlay className="h-4 w-4" />,
    index: "04",
    title: "Digital Craft",
    description:
      "Sites and interfaces engineered with the same restraint as the film that lives inside them.",
  },
  {
    area: "md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]",
    icon: <Waves className="h-4 w-4" />,
    index: "05",
    title: "Sound & Score",
    description:
      "Original scoring and sound design, mixed to carry a room, a trailer, or a pair of headphones alike.",
  },
];

export function Feature() {
  return (
    <section className="relative w-full bg-[#050505] px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto mb-14 max-w-7xl md:mb-20">
        <span className="mb-4 block font-sans text-xs uppercase tracking-[0.3em] text-[#8f6b3f]">
          Capabilities
        </span>
        <h2 className="font-serif text-4xl leading-[1.1] tracking-[-0.02em] text-[#f2ede4] md:text-6xl">
          Everything inside the frame,
          <br />
          made in one house.
        </h2>
      </div>

      <ul className="mx-auto grid max-w-7xl grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
        {CAPABILITIES.map((item) => (
          <GridItem key={item.index} {...item} />
        ))}
      </ul>
    </section>
  );
}

interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  index: string;
  title: string;
  description: React.ReactNode;
}

const GridItem = ({ area, icon, index, title, description }: GridItemProps) => {
  return (
    <li className={cn("min-h-[14rem] list-none", area)}>
      <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-[#f2ede4]/10 p-2 md:rounded-[1.5rem] md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={2}
        />
        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-[0.75px] border-[#f2ede4]/10 bg-[#0a0a0a] p-6 shadow-[0px_0px_27px_0px_rgba(0,0,0,0.4)] md:p-6">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <div className="w-fit rounded-lg border-[0.75px] border-[#f2ede4]/10 bg-[#f2ede4]/[0.03] p-2 text-[#f2ede4]">
                {icon}
              </div>
              <span className="font-sans text-xs tracking-[0.2em] text-[#f2ede4]/30">
                {index}
              </span>
            </div>
            <div className="space-y-3">
              <h3 className="pt-0.5 font-serif text-xl leading-[1.375rem] tracking-[-0.02em] text-balance text-[#f2ede4] md:text-2xl md:leading-[1.875rem]">
                {title}
              </h3>
              <p className="font-sans text-sm leading-[1.125rem] text-[#f2ede4]/60 md:text-base md:leading-[1.375rem]">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};