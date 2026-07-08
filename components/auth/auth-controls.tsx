"use client";

import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { QuizButton } from "@/components/ui/quiz-button";

export function AuthControls() {
  return (
    <Show
      when="signed-in"
      fallback={
        <SignInButton mode="modal">
          <QuizButton
            color="lime"
            textColor="black"
            className="!min-w-0 !h-9 !px-4 !text-xs shrink-0"
          >
            Sign in
          </QuizButton>
        </SignInButton>
      }
    >
      <UserButton
        appearance={{
          elements: {
            avatarBox: "h-9 w-9 border-2 border-black/15",
          },
        }}
      />
    </Show>
  );
}
