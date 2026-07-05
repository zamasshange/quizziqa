"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

type QuizButtonColor = "green" | "green-dark" | "cyan" | "lime";

const colorMap: Record<QuizButtonColor, string> = {
  green: "#c6ea84",
  "green-dark": "#00a76d",
  cyan: "#6feeff",
  lime: "#c6ea84",
};

interface QuizButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: QuizButtonColor;
  textColor?: "white" | "black";
  size?: "sm" | "md" | "lg";
}

export function QuizButton({
  color = "green-dark",
  textColor = "white",
  className,
  children,
  size = "md",
  ...props
}: QuizButtonProps) {
  const bgColor = colorMap[color];
  const pad = size === "sm" ? "3px" : "4px";

  return (
    <button
      type="button"
      className={cn(
        "relative inline-flex items-center justify-center font-bold touch-manipulation",
        "rounded-[3.125rem] border-[3px] border-black",
        size === "sm" ? "h-10 px-5 text-sm" : "h-12 md:h-14 px-6 text-base md:text-lg",
        textColor === "white" ? "text-white" : "text-black",
        "shadow-[0_4px_0_#000] active:shadow-[0_1px_0_#000] active:translate-y-[3px]",
        "transition-[transform,box-shadow] duration-100",
        className
      )}
      style={{ backgroundColor: bgColor }}
      {...props}
    >
      {children}
    </button>
  );
}

export function QuizButtonLink({
  href,
  color = "green-dark",
  textColor = "white",
  children,
  className,
  size = "md",
}: {
  href: string;
  color?: QuizButtonColor;
  textColor?: "white" | "black";
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const bgColor = colorMap[color];

  return (
    <Link
      href={href}
      className={cn(
        "relative inline-flex items-center justify-center font-bold touch-manipulation",
        "rounded-[3.125rem] border-[3px] border-black",
        size === "sm" ? "h-10 px-5 text-sm" : "h-12 md:h-14 px-6 text-base md:text-lg",
        textColor === "white" ? "text-white" : "text-black",
        "shadow-[0_4px_0_#000] active:shadow-[0_1px_0_#000] active:translate-y-[3px]",
        "transition-[transform,box-shadow] duration-100",
        className
      )}
      style={{ backgroundColor: bgColor }}
    >
      {children}
    </Link>
  );
}
