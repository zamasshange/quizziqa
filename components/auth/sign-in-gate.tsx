"use client";

import { SignIn } from "@clerk/nextjs";
import { QuizButtonLink } from "@/components/ui/quiz-button";

export function SignInGate() {
  const clerkEnabled = Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim()
  );

  if (!clerkEnabled) {
    return (
      <div className="max-w-sm text-center space-y-4 rounded-2xl border border-black/15 bg-white p-8 shadow-soft-1">
        <h1 className="text-2xl font-black">Sign in</h1>
        <p className="text-sm font-bold text-black/60">
          Authentication isn&apos;t configured on this deployment yet. Add the
          Clerk keys in Vercel and redeploy.
        </p>
        <QuizButtonLink href="/" color="lime" textColor="black">
          Back home
        </QuizButtonLink>
      </div>
    );
  }

  return (
    <SignIn
      routing="path"
      path="/signin"
      signUpUrl="/signin"
      forceRedirectUrl="/"
      appearance={{
        elements: {
          rootBox: "mx-auto",
          card: "shadow-soft-1 border border-black/15",
        },
      }}
    />
  );
}
