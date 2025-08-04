"use client";

import { cn } from "@/lib/utils";
import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import React, { useCallback, useEffect, useRef } from "react";

interface HoverCardEffectProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  effectSize?: number;
  effectColor?: string;
  effectOpacity?: number;
}

export function HoverCardEffect({
  children,
  className,
  containerClassName,
  effectSize = 200,
  effectColor = "#e2e8f0",
  effectOpacity = 0.1,
}: HoverCardEffectProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(-effectSize);
  const mouseY = useMotionValue(-effectSize);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (cardRef.current) {
        const { left, top } = cardRef.current.getBoundingClientRect();
        const clientX = e.clientX;
        const clientY = e.clientY;
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
      }
    },
    [mouseX, mouseY],
  );

  const handleMouseOut = useCallback(
    (e: MouseEvent) => {
      if (!e.relatedTarget) {
        document.removeEventListener("mousemove", handleMouseMove);
        mouseX.set(-effectSize);
        mouseY.set(-effectSize);
      }
    },
    [handleMouseMove, mouseX, effectSize, mouseY],
  );

  const handleMouseEnter = useCallback(() => {
    document.addEventListener("mousemove", handleMouseMove);
    mouseX.set(-effectSize);
    mouseY.set(-effectSize);
  }, [handleMouseMove, mouseX, effectSize, mouseY]);

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseout", handleMouseOut);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseout", handleMouseOut);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [handleMouseEnter, handleMouseMove, handleMouseOut]);

  useEffect(() => {
    mouseX.set(-effectSize);
    mouseY.set(-effectSize);
  }, [effectSize, mouseX, mouseY]);

  return (
    <div
      ref={cardRef}
      className={cn("group relative rounded-[inherit]", containerClassName)}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(${effectSize}px circle at ${mouseX}px ${mouseY}px, ${effectColor}, transparent 100%)
          `,
          opacity: effectOpacity,
        }}
      />
      <div className={cn("relative", className)}>{children}</div>
    </div>
  );
}