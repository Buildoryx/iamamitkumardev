"use client";
import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export const Box = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <motion.div
      className={cn(
        // Flattened: previously carried shadow-lg + ring-1 + ring-offset-2 +
        // ring-inset, which drew a visible second edge around every icon and
        // read as a box inside a box — repeated ~15 times down the homepage.
        // Colour still comes from call sites via className.
        "relative flex aspect-square size-7 items-center justify-center rounded-md bg-linear-to-b from-blue-400 to-blue-600 align-middle",
        className,
      )}
    >
      {children}
    </motion.div>
  );
};
