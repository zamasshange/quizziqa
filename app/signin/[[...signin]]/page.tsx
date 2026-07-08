import { SignIn } from "@clerk/nextjs";
import { AppShell } from "@/components/layout/app-shell";

export default function SignInPage() {
  return (
    <AppShell hideNav>
      <div className="flex flex-1 items-center justify-center min-h-[70dvh] px-4 py-8">
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
      </div>
    </AppShell>
  );
}
