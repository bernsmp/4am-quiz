"use client";

import React from "react";

export function AnimatedHighlightHeader() {
  return (
    <span className="inline-block relative">
      <span className="relative z-10">
        Here&apos;s What Changed.
      </span>
      <span className="absolute inset-0 bg-[#86c543] origin-left animate-highlight-sweep -z-0" />
    </span>
  );
}
