export type TimerOption = 0 | 10 | 15 | 20 | 30 | 45 | 60;
export type QuestionCountOption = 5 | 10 | 20 | 30 | 50;
export type AnswerMode = "multiple-choice" | "typing" | "mixed" | "random";
export type PerformanceMode = "high" | "balanced" | "battery";
export type ThemeOption = "light" | "dark" | "system";
export type AnimationLevel = "full" | "reduced";

export interface GameSettings {
  timer: TimerOption;
  difficulty: "easy" | "medium" | "hard" | "expert" | "impossible";
  questionCount: QuestionCountOption;
  answerMode: AnswerMode;
  hintsEnabled: boolean;
  soundEnabled: boolean;
  musicEnabled: boolean;
  vibrationEnabled: boolean;
  animations: AnimationLevel;
  performanceMode: PerformanceMode;
  theme: ThemeOption;
  colorblindMode: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
}

export const DEFAULT_SETTINGS: GameSettings = {
  timer: 20,
  difficulty: "medium",
  questionCount: 10,
  answerMode: "multiple-choice",
  hintsEnabled: true,
  soundEnabled: true,
  musicEnabled: false,
  vibrationEnabled: true,
  animations: "full",
  performanceMode: "balanced",
  theme: "light",
  colorblindMode: false,
  largeText: false,
  reducedMotion: false,
  masterVolume: 80,
  musicVolume: 60,
  sfxVolume: 100,
};

const SETTINGS_KEY = "guess-everything-settings";

export function loadGameSettings(): GameSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveGameSettings(settings: GameSettings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export const TIMER_OPTIONS: { value: TimerOption; label: string }[] = [
  { value: 0, label: "Off" },
  { value: 10, label: "10s" },
  { value: 15, label: "15s" },
  { value: 20, label: "20s" },
  { value: 30, label: "30s" },
  { value: 45, label: "45s" },
  { value: 60, label: "60s" },
];

export const QUESTION_COUNT_OPTIONS: QuestionCountOption[] = [5, 10, 20, 30, 50];

export const DIFFICULTY_OPTIONS = [
  "easy",
  "medium",
  "hard",
  "expert",
  "impossible",
] as const;
