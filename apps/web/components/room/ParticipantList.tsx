"use client";

import type { Participant } from "@repo/types";
import { ParticipantRow } from "./ParticipantRow";

interface ParticipantListProps {
  participants: Participant[];
}

export const ParticipantList = ({ participants }: ParticipantListProps) => {
  return (
    <div className="flex flex-col gap-1 max-w-lg mx-auto w-full">
      {participants.map((p) => (
        <ParticipantRow key={p.id} participant={p} />
      ))}
    </div>
  );
};
