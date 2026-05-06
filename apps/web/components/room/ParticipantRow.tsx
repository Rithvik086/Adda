"use client";

import type { Participant } from "@repo/types";
import { Avatar, StatusBadge } from "@repo/ui";

interface ParticipantRowProps {
  participant: Participant;
}

export const ParticipantRow = ({ participant }: ParticipantRowProps) => {
  const isSpeaking = participant.status === "SPEAKING";
  const isMuted = participant.status === "MUTED";

  return (
    <div
      className={`
        flex items-center gap-4 py-3 px-2 rounded-xl
        transition-all duration-300
        ${isSpeaking ? "bg-surface-container-highest/30" : ""}
      `}
    >
      {/* Avatar */}
      <Avatar
        color={participant.avatarColor}
        name={participant.name}
        size="md"
        speaking={isSpeaking}
        src={participant.avatarUrl}
      />

      {/* Name + Status */}
      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
        <span
          className={`text-sm font-semibold tracking-tight truncate ${
            isSpeaking ? "text-on-surface" : "text-on-surface-variant"
          }`}
        >
          {participant.name}
        </span>
        <StatusBadge status={participant.status} />
      </div>

      {/* Right-side mic / voice icon */}
      <div className="flex-shrink-0">
        {isSpeaking ? (
          <span className="material-symbols-outlined text-primary text-xl">
            graphic_eq
          </span>
        ) : (
          <span
            className={`material-symbols-outlined text-lg ${
              isMuted ? "text-outline-variant" : "text-outline"
            }`}
            style={
              isMuted
                ? { fontVariationSettings: "'FILL' 0" }
                : { fontVariationSettings: "'FILL' 0" }
            }
          >
            {isMuted ? "mic_off" : "mic"}
          </span>
        )}
      </div>
    </div>
  );
};
