/** Possible participant statuses in a voice room */
export type ParticipantStatus = "SPEAKING" | "LISTENING" | "MUTED" | "ONLINE";

/** A single participant in a voice room */
export interface Participant {
  id: string;
  name: string;
  avatarUrl?: string;
  /** Color used for the avatar fallback circle */
  avatarColor: string;
  status: ParticipantStatus;
}

/** Room metadata returned from the API */
export interface Room {
  id: string;
  /** Human-readable room name, e.g. "Midnight Echo" */
  name: string;
  /** Session code, e.g. "KV7-8D1" */
  sessionCode: string;
  participants: Participant[];
  /** Minutes remaining before auto-close (null = no limit) */
  closesInMinutes: number | null;
  /** ISO timestamp of when the room was created */
  createdAt: string;
}
