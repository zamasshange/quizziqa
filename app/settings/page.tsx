"use client";

import { AppShell } from "@/components/layout/app-shell";
import { useGameSettings } from "@/hooks/use-game-settings";
import {
  TIMER_OPTIONS,
  QUESTION_COUNT_OPTIONS,
  DIFFICULTY_OPTIONS,
  type TimerOption,
  type QuestionCountOption,
} from "@/lib/game/settings";
import { QuizButton } from "@/components/ui/quiz-button";
import { cn } from "@/lib/utils";
import { audioManager } from "@/lib/audio/audio-manager";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl bg-white border border-black/15 p-4 shadow-soft-1 space-y-3">
      <h2 className="text-sm font-black text-black uppercase tracking-wide">{title}</h2>
      {children}
    </section>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 cursor-pointer">
      <span className="text-sm font-bold text-black/80">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => {
          onChange(!checked);
          audioManager.play("click");
        }}
        className={cn(
          "relative w-11 h-6 rounded-full transition-colors border-2 border-black",
          checked ? "bg-btn-green" : "bg-secondary"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 w-4 h-4 rounded-full bg-white border border-black transition-transform",
            checked ? "translate-x-5" : "translate-x-0.5"
          )}
        />
      </button>
    </label>
  );
}

function ChipSelect<T extends string | number>({
  options,
  value,
  onChange,
  labels,
}: {
  options: T[];
  value: T;
  onChange: (v: T) => void;
  labels?: Record<string, string>;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={String(opt)}
          type="button"
          onClick={() => {
            onChange(opt);
            audioManager.play("click");
          }}
          className={cn(
            "px-3 py-1.5 rounded-full text-xs font-black border-2 border-black transition-colors",
            value === opt ? "bg-btn-green text-black" : "bg-white text-black/70"
          )}
        >
          {labels?.[String(opt)] ?? String(opt)}
        </button>
      ))}
    </div>
  );
}

export default function SettingsPage() {
  const { settings, updateSettings, resetSettings } = useGameSettings();

  const timerLabels = Object.fromEntries(
    TIMER_OPTIONS.map((t) => [String(t.value), t.label])
  );

  return (
    <AppShell>
      <div className="max-w-lg mx-auto space-y-4 pb-8">
        <div className="text-center mb-2">
          <h1 className="text-2xl font-black text-black">Game Settings</h1>
          <p className="text-xs font-bold text-black/50 mt-1">
            Customize your gameplay experience
          </p>
        </div>

        <Section title="Gameplay">
          <div className="space-y-2">
            <p className="text-xs font-bold text-black/50">Timer</p>
            <ChipSelect
              options={TIMER_OPTIONS.map((t) => t.value)}
              value={settings.timer}
              onChange={(v) => updateSettings({ timer: v as TimerOption })}
              labels={timerLabels}
            />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-bold text-black/50">Difficulty</p>
            <ChipSelect
              options={[...DIFFICULTY_OPTIONS]}
              value={settings.difficulty}
              onChange={(v) =>
                updateSettings({ difficulty: v as typeof settings.difficulty })
              }
            />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-bold text-black/50">Questions per game</p>
            <ChipSelect
              options={[...QUESTION_COUNT_OPTIONS]}
              value={settings.questionCount}
              onChange={(v) =>
                updateSettings({ questionCount: v as QuestionCountOption })
              }
            />
          </div>
        </Section>

        <Section title="Hints & Help">
          <Toggle
            label="Hints enabled"
            checked={settings.hintsEnabled}
            onChange={(v) => updateSettings({ hintsEnabled: v })}
          />
        </Section>

        <Section title="Audio">
          <Toggle
            label="Sound effects"
            checked={settings.soundEnabled}
            onChange={(v) => updateSettings({ soundEnabled: v })}
          />
          <Toggle
            label="Background music"
            checked={settings.musicEnabled}
            onChange={(v) => updateSettings({ musicEnabled: v })}
          />
          <Toggle
            label="Vibration (mobile)"
            checked={settings.vibrationEnabled}
            onChange={(v) => updateSettings({ vibrationEnabled: v })}
          />
          <div>
            <label className="text-xs font-bold text-black/50">Master volume</label>
            <input
              type="range"
              min={0}
              max={100}
              value={settings.masterVolume}
              onChange={(e) => updateSettings({ masterVolume: Number(e.target.value) })}
              className="w-full mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-black/50">SFX volume</label>
            <input
              type="range"
              min={0}
              max={100}
              value={settings.sfxVolume}
              onChange={(e) => updateSettings({ sfxVolume: Number(e.target.value) })}
              className="w-full mt-1"
            />
          </div>
        </Section>

        <Section title="Display & Accessibility">
          <Toggle
            label="Reduced motion"
            checked={settings.reducedMotion}
            onChange={(v) => {
              updateSettings({ reducedMotion: v, animations: v ? "reduced" : "full" });
            }}
          />
          <Toggle
            label="Large text"
            checked={settings.largeText}
            onChange={(v) => updateSettings({ largeText: v })}
          />
          <Toggle
            label="Colorblind mode"
            checked={settings.colorblindMode}
            onChange={(v) => updateSettings({ colorblindMode: v })}
          />
        </Section>

        <QuizButton color="cyan" textColor="black" className="w-full" onClick={resetSettings}>
          Reset to defaults
        </QuizButton>
      </div>
    </AppShell>
  );
}
