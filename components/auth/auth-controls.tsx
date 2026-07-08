"use client";

import Link from "next/link";
import { QuizButton } from "@/components/ui/quiz-button";

export function AuthControls() {
  // Always use a plain link — avoids Clerk client crashes when env keys
  // aren't set on the deployment host. Real Clerk UI mounts on /signin.
  return (
    <Link href="/signin">
      <QuizButton
        color="lime"
        textColor="black"
        className="!min-w-0 !h-9 !px-4 !text-xs shrink-0"
      >
        Sign in
      </QuizButton>
    </Link>
  );
}
