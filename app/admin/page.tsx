"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  FolderOpen,
  HelpCircle,
  Image,
  Trophy,
  Calendar,
  Star,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { categories } from "@/lib/data/categories";
import { games } from "@/lib/data/games";
import { achievements } from "@/lib/data/achievements";
import { cn } from "@/lib/utils";
import { QuizButton } from "@/components/ui/quiz-button";

const adminTabs = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "categories", label: "Categories", icon: FolderOpen },
  { id: "questions", label: "Questions", icon: HelpCircle },
  { id: "images", label: "Images", icon: Image },
  { id: "achievements", label: "Achievements", icon: Trophy },
  { id: "daily", label: "Daily", icon: Calendar },
  { id: "featured", label: "Featured", icon: Star },
] as const;

type AdminTab = (typeof adminTabs)[number]["id"];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");

  return (
    <AppShell>
      <div className="flex items-center gap-2 mb-4">
        <span className="bg-answer4 text-black text-xs font-black px-2 py-0.5 rounded-full border border-black">
          Admin
        </span>
        <span className="text-xs font-bold text-black/60">Manage content without coding</span>
      </div>

      <h1 className="text-3xl font-black text-black mb-4">Admin Dashboard</h1>

      <div className="overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 mb-4">
        <div className="flex gap-1 w-max">
          {adminTabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={cn(
                "flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-black whitespace-nowrap transition-colors touch-target",
                activeTab === id
                  ? "bg-petrol-dark text-white"
                  : "bg-black/5 text-black/60"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "overview" && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Categories", value: categories.length, emoji: "📂" },
            { label: "Games", value: games.length, emoji: "🎮" },
            {
              label: "Questions",
              value: games.reduce((a, g) => a + g.questions.length, 0),
              emoji: "❓",
            },
            { label: "Achievements", value: achievements.length, emoji: "🏆" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl bg-white border border-black/15 p-4 text-center shadow-soft-1"
            >
              <div className="text-2xl mb-1">{stat.emoji}</div>
              <div className="text-xl font-black">{stat.value}</div>
              <div className="text-[10px] font-bold text-black/60">{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "categories" && (
        <div className="space-y-2">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="rounded-xl bg-white border border-black/15 p-3 flex items-center justify-between shadow-soft-1"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{cat.emoji}</span>
                <div>
                  <div className="font-black text-sm">{cat.name}</div>
                  <div className="text-xs font-bold text-black/60">{cat.gameCount} games</div>
                </div>
              </div>
              <QuizButton color="cyan" textColor="black" size="sm" className="!min-w-0 !h-9 !px-3 !text-xs">
                Edit
              </QuizButton>
            </div>
          ))}
        </div>
      )}

      {activeTab === "questions" && (
        <div className="space-y-2">
          {games.flatMap((game) =>
            game.questions.map((q) => (
              <div key={q.id} className="rounded-xl bg-white border border-black/15 p-3 space-y-1 shadow-soft-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black bg-secondary px-2 py-0.5 rounded-full border border-black/10">
                    {game.title}
                  </span>
                  <span className="text-[10px] font-black text-black/50">{q.difficulty}</span>
                </div>
                <p className="text-sm font-bold">{q.question}</p>
                <p className="text-xs font-bold text-black/60">Answer: {q.answer}</p>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "achievements" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {achievements.map((a) => (
            <div
              key={a.id}
              className="rounded-xl bg-white border border-black/15 p-3 text-center shadow-soft-1"
            >
              <div className="text-2xl">{a.emoji}</div>
              <div className="font-black text-xs mt-1">{a.title}</div>
              <div className="text-[10px] font-bold text-black/60">+{a.xpBonus} XP</div>
            </div>
          ))}
        </div>
      )}

      {(activeTab === "images" || activeTab === "daily" || activeTab === "featured") && (
        <div className="rounded-xl bg-white border border-black/15 p-8 text-center shadow-soft-1">
          <p className="text-4xl mb-3">🚧</p>
          <p className="text-sm font-bold text-black/60">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} management panel coming soon.
          </p>
          <QuizButton color="green-dark" className="mt-4 mx-auto">
            + Add New
          </QuizButton>
        </div>
      )}
    </AppShell>
  );
}
