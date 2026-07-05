export default function PlayLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40dvh] gap-3">
      <div className="w-8 h-8 rounded-full border-[3px] border-black/10 border-t-btn-green animate-spin" />
      <p className="text-black/50 font-bold text-sm">Starting game…</p>
    </div>
  );
}
