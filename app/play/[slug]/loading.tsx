export default function PlayLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50dvh] gap-4">
      <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-answer4 animate-spin" />
      <p className="text-white/80 font-bold text-sm">Loading questions from Wikipedia…</p>
    </div>
  );
}
