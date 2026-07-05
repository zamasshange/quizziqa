"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 pt-6 pb-8">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none" />
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-accent/20 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative max-w-7xl mx-auto text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-flex items-center gap-1.5 bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-semibold mb-4"
        >
          <Sparkles className="h-3.5 w-3.5" />
          847+ Games to Master
        </motion.div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-3">
          Can You{" "}
          <span className="gradient-text">Guess Everything?</span>
        </h1>

        <p className="text-muted-foreground text-base sm:text-lg max-w-md mx-auto mb-8">
          Play hundreds of guessing games, earn XP, unlock achievements, and
          learn something new with every answer.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button size="xl" className="w-full sm:w-auto min-w-[200px]" asChild>
            <Link href="/categories">
              <Play className="h-5 w-5 fill-current" />
              Play Now
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full sm:w-auto"
            asChild
          >
            <Link href="/daily">Daily Challenge</Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
