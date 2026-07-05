import { loadGameSettings } from "@/lib/game/settings";

type SfxId =
  | "click"
  | "correct"
  | "wrong"
  | "xp"
  | "coin"
  | "combo"
  | "victory"
  | "levelUp"
  | "achievement"
  | "countdown"
  | "powerUp"
  | "next";

const FREQUENCIES: Record<SfxId, number> = {
  click: 440,
  correct: 660,
  wrong: 220,
  xp: 880,
  coin: 988,
  combo: 784,
  victory: 523,
  levelUp: 1047,
  achievement: 1175,
  countdown: 330,
  powerUp: 550,
  next: 494,
};

class AudioManager {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      this.ctx = new AudioContext();
    }
    return this.ctx;
  }

  private volume(): number {
    const s = loadGameSettings();
    if (!s.soundEnabled) return 0;
    return (s.masterVolume / 100) * (s.sfxVolume / 100);
  }

  play(id: SfxId): void {
    const vol = this.volume();
    if (vol <= 0) return;

    const ctx = this.getContext();
    if (!ctx) return;

    if (ctx.state === "suspended") void ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = id === "wrong" ? "sawtooth" : "sine";
    osc.frequency.value = FREQUENCIES[id];
    gain.gain.value = vol * 0.15;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);

    const s = loadGameSettings();
    if (s.vibrationEnabled && "vibrate" in navigator) {
      if (id === "correct") navigator.vibrate(30);
      if (id === "wrong") navigator.vibrate([50, 30, 50]);
    }
  }

  playCorrect(): void {
    this.play("correct");
    setTimeout(() => this.play("xp"), 80);
  }

  playWrong(): void {
    this.play("wrong");
  }

  playNext(): void {
    this.play("next");
  }
}

export const audioManager = new AudioManager();
