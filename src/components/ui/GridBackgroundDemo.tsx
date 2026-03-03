"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GridBackgroundDemoProps {
  children?: ReactNode; // ✅ typed properly
}

export function GridBackgroundDemo({
  children,
}: GridBackgroundDemoProps) {
  return (
    <div className="relative w-full min-h-screen bg-black overflow-hidden">
      {/* Grid */}
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)]"
        )}
      />

      {/* Edge Fade */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.8))]" />

      {/* Content */}
      <div className="relative z-20">{children}</div>
    </div>
  );
}