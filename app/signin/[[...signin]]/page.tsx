import { AppShell } from "@/components/layout/app-shell";
import { SignInGate } from "@/components/auth/sign-in-gate";

export default function SignInPage() {
  return (
    <AppShell hideNav>
      <div className="flex flex-1 items-center justify-center min-h-[70dvh] px-4 py-8">
        <SignInGate />
      </div>
    </AppShell>
  );
}
