"use client";

import type { Participant } from "@repo/types";
import { Avatar, StatusBadge } from "@repo/ui";

interface ParticipantCardProps {
  participant: Participant;
}

export const ParticipantCard = ({ participant }: ParticipantCardProps) => {
  const isSpeaking = participant.status === "SPEAKING";

  return (
    <div
      className={`
        relative group rounded-2xl p-6 flex flex-col items-center gap-4
        transition-all duration-300 cursor-default select-none
        ${isSpeaking
          ? "bg-surface-container-highest"
          : "bg-surface-container hover:bg-surface-container-high"
        }
      `}
    >
      {/* Speaking glow behind the card */}
      {isSpeaking && (
        <div
          className="absolute inset-0 rounded-2xl -z-10 animate-pulse"
          style={{
            boxShadow: "0 0 40px 8px rgba(186, 158, 255, 0.15)",
          }}
        />
      )}

      {/* Avatar */}
      <Avatar
        color={participant.avatarColor}
        name={participant.name}
        size="lg"
        speaking={isSpeaking}
        src={participant.avatarUrl}
      />

      {/* Name */}
      <span
        className={`text-sm font-semibold tracking-tight text-center leading-tight ${
          isSpeaking ? "text-on-surface" : "text-on-surface-variant"
        }`}
      >
        {participant.name}
      </span>

      {/* Status Badge */}
      <StatusBadge status={participant.status} />

      {/* Muted icon overlay */}
      {participant.status === "MUTED" && (
        <div className="absolute top-4 right-4">
          <span className="material-symbols-outlined text-outline text-sm">
            mic_off
          </span>
        </div>
      )}
    </div>
  );
};
