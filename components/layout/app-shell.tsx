import { QuizNav, QuizCategoryNav, QuizMobileCategoryNav } from "@/components/layout/quiz-nav";
import Link from "next/link";
import { AuthControls } from "@/components/auth/auth-controls";

interface AppShellProps {
  children: React.ReactNode;
  playMode?: boolean;
  hideNav?: boolean;
}

export function AppShell({
  children,
  playMode = false,
  hideNav = false,
}: AppShellProps) {
  return (
    <div className="relative z-[1] flex flex-col min-h-dvh bg-background">
      {!hideNav && <QuizNav minimal={playMode} />}

      {playMode ? (
        <div className="relative flex flex-col flex-1 w-full h-dvh max-h-dvh overflow-hidden">
          {children}
        </div>
      ) : (
        <div className="relative flex flex-col flex-1 w-full">
          <div className="custom-container flex flex-col md:flex-row md:gap-6 flex-1 py-4">
            {!hideNav && (
              <aside className="hidden md:block md:w-36 lg:w-44 shrink-0">
                <QuizCategoryNav />
              </aside>
            )}

            <div className="flex flex-col flex-1 min-w-0">
              {!hideNav && <QuizMobileCategoryNav />}

              {!hideNav && (
                <div className="flex items-center justify-between gap-2 py-2 mb-2 border-b border-black/10">
                  <div className="flex items-center gap-3 md:gap-4 overflow-x-auto no-scrollbar">
                    <Link href="/daily" className="text-xs font-bold text-black/60 hover:text-black whitespace-nowrap">
                      Daily
                    </Link>
                    <Link href="/leaderboards" className="text-xs font-bold text-black/60 hover:text-black whitespace-nowrap">
                      Leaderboards
                    </Link>
                    <Link href="/profile" className="text-xs font-bold text-black/60 hover:text-black whitespace-nowrap">
                      Profile
                    </Link>
                    <Link href="/settings" className="text-xs font-bold text-black/60 hover:text-black whitespace-nowrap">
                      Settings
                    </Link>
                    <Link href="/search" className="text-xs font-bold text-black/60 hover:text-black whitespace-nowrap">
                      Search
                    </Link>
                    <Link href="/collections" className="text-xs font-bold text-black/60 hover:text-black whitespace-nowrap hidden sm:inline">
                      Collections
                    </Link>
                  </div>
                  <AuthControls />
                </div>
              )}

              <main>{children}</main>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
