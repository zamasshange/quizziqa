"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDays, Users, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDailySeed } from "@/lib/utils";

const dailyChallenges = [
  { emoji: "🏳", title: "Daily Flag", slug: "world-flags" },
  { emoji: "🐾", title: "Daily Animal", slug: "guess-the-animal" },
  { emoji: "🍕", title: "Daily Food", slug: "food-emoji-quiz" },
  { emoji: "🚗", title: "Daily Car", slug: "car-silhouettes" },
  { emoji: "🎬", title: "Daily Movie", slug: "movie-quotes" },
  { emoji: "🏰", title: "Daily Landmark", slug: "famous-landmarks" },
];

function getTodayChallenge() {
  const seed = getDailySeed();
  const hash = seed.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return dailyChallenges[hash % dailyChallenges.length];
}

export function DailyChallengeBanner() {
  const challenge = getTodayChallenge();
  const participants = 12847 + (new Date().getDate() * 137);

  return (
    <section className="px-4 pb-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="overflow-hidden border-2 border-accent/30 bg-gradient-to-br from-accent/10 to-primary/10">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="text-4xl">{challenge.emoji}</div>
                <div>
                  <Badge variant="accent" className="mb-1">
                    <CalendarDays className="h-3 w-3 mr-1" />
                    Daily Challenge
                  </Badge>
                  <h3 className="font-bold text-lg">{challenge.title}</h3>
                </div>
              </div>
              <div className="flex items-center gap-1 text-accent">
                <Flame className="h-4 w-4" />
                <span className="text-sm font-bold">5</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {participants.toLocaleString()} playing today
              </span>
            </div>

            <Button className="w-full" size="lg" asChild>
              <Link href={`/play/${challenge.slug}?daily=true`}>
                Play Today&apos;s Challenge
              </Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
}
