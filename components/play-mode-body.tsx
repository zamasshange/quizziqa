"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function PlayModeBody({ playMode }: { playMode: boolean }) {
  const pathname = usePathname();

  useEffect(() => {
    const isPlay = playMode || pathname.startsWith("/play/");
    document.body.classList.toggle("play-mode", isPlay);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", "#FFFDF4");
    return () => document.body.classList.remove("play-mode");
  }, [playMode, pathname]);

  return null;
}
