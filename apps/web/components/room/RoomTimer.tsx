"use client";

interface RoomTimerProps {
  closesInMinutes: number | null;
}

export const RoomTimer = ({ closesInMinutes }: RoomTimerProps) => {
  if (closesInMinutes === null) return null;

  return (
    <div className="flex flex-col items-center gap-2 mt-12">
      <span className="material-symbols-outlined text-on-surface-variant/40 text-xl">
        timer
      </span>
      <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/40">
        This void closes in {closesInMinutes} minutes
      </span>
    </div>
  );
};
