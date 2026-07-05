"use client";

import Link from "next/link";
import { getDailySeed } from "@/lib/utils";
import { QuizButtonLink } from "@/components/ui/quiz-button";

const dailyChallenges = [
  { slug: "guess-the-celebrity" },
  { slug: "guess-the-city" },
  { slug: "guess-the-flag" },
  { slug: "guess-the-animal-wiki" },
  { slug: "guess-the-food" },
];

function getTodaySlug() {
  const seed = getDailySeed();
  const hash = seed.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return dailyChallenges[hash % dailyChallenges.length].slug;
}

export function DailyJoinBanner() {
  const todaySlug = getTodaySlug();

  return (
    <div className="md:hidden block w-full pt-6">
      <div className="flex flex-1 px-4">
        <div className="rounded-xl bg-answer4 md:p-4 flex flex-col items-center justify-center w-full gap-2 p-4 overflow-hidden">
          <div className="justify-evenly flex flex-row items-center w-full px-2">
            <div className="whitespace-nowrap flex flex-row items-center gap-4 font-sans md:text-base lg:text-xl text-base font-black leading-tight tracking-normal text-black capitalize">
              <div className="md:flex-row md:gap-2 flex flex-col items-center">
                <div className="block">Daily</div>
                <div className="block">Challenge?</div>
              </div>
              <QuizButtonLink
                href={`/play/${todaySlug}?daily=true`}
                color="green-dark"
                size="sm"
                className="!min-w-0 !px-4 !h-12 !text-base"
              >
                Play Today
              </QuizButtonLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PromoBanners() {
  const todaySlug = getTodaySlug();

  return (
    <div className="md:flex-row flex flex-col gap-4">
      <div className="md:w-1/2 bg-petrol-dark rounded-xl md:p-8 lg:p-0 flex flex-row items-center justify-start w-full gap-8 p-4">
        <div className="aspect-square lg:block relative hidden w-5/12 ml-8">
          <div className="absolute inset-0 flex items-center justify-center text-[120px]">
            🎯
          </div>
        </div>
        <div className="lg:w-7/12 lg:mr-8 lg:my-8 flex flex-col items-center justify-center w-full">
          <h2 className="md:text-4xl lg:text-3xl xl:text-4xl md:pb-0 pb-2 text-3xl font-black leading-none text-center text-white">
            Daily Challenge
          </h2>
          <h3 className="md:text-base lg:text-xl flex flex-col items-center justify-center pb-4 text-sm font-bold leading-none text-center text-white">
            <div>Play today&apos;s game</div>
            <div>Maintain your streak</div>
          </h3>
          <QuizButtonLink href={`/play/${todaySlug}?daily=true`} color="green-dark">
            Play now
          </QuizButtonLink>
        </div>
      </div>

      <div className="md:w-1/2 bg-petrol-dark rounded-xl md:p-0 flex flex-row items-center justify-start w-full gap-8 p-4">
        <div className="aspect-square lg:block relative hidden w-5/12 ml-8">
          <div className="absolute inset-0 flex items-center justify-center text-[120px]">
            🌍
          </div>
        </div>
        <div className="lg:w-7/12 lg:mr-8 lg:my-8 flex flex-col items-center justify-center w-full">
          <h2 className="md:text-4xl lg:text-3xl xl:text-4xl md:pb-0 pb-2 text-3xl font-black leading-none text-center text-white">
            847+ Games
          </h2>
          <h3 className="md:text-base lg:text-xl flex flex-col items-center justify-center pb-4 text-sm font-bold leading-none text-center text-white">
            <div>Guess from images, emojis</div>
            <div>and clues across 19 categories</div>
          </h3>
          <QuizButtonLink href="/categories" color="cyan" textColor="black">
            Browse games
          </QuizButtonLink>
        </div>
      </div>
    </div>
  );
}
