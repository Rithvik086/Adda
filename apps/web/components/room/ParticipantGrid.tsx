"use client";

import type { Participant } from "@repo/types";
import { ParticipantCard } from "./ParticipantCard";

interface ParticipantGridProps {
  participants: Participant[];
}

export const ParticipantGrid = ({ participants }: ParticipantGridProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {participants.map((p) => (
        <ParticipantCard key={p.id} participant={p} />
      ))}
    </div>
  );
};
