import type { Room } from "@repo/types";

/**
 * Hardcoded room data for development.
 * Replace this function body with an API call when the backend is ready.
 *
 * Example future usage:
 *   export async function fetchRoomByCode(code: string): Promise<Room | null> {
 *     const res = await fetch(`/api/rooms/${code}`);
 *     if (!res.ok) return null;
 *     return res.json();
 *   }
 */
export async function fetchRoomByCode(code: string): Promise<Room | null> {
  // Simulate a small network delay
  await new Promise((r) => setTimeout(r, 100));

  // Accept any 4+ character code for now
  if (!code || code.length < 4) return null;

  return {
    id: "room-001",
    name: "Midnight Echo",
    sessionCode: "XV7-991",
    closesInMinutes: 42,
    createdAt: new Date().toISOString(),
    participants: [
      {
        id: "u1",
        name: "Erik Larsson",
        avatarColor: "#6e3bd7",
        status: "SPEAKING",
      },
      {
        id: "u2",
        name: "Sarah Chen",
        avatarColor: "#a70138",
        status: "LISTENING",
      },
      {
        id: "u3",
        name: "Marcus Thorne",
        avatarColor: "#1a7a5c",
        status: "ONLINE",
      },
      {
        id: "u4",
        name: "Elena Rossi",
        avatarColor: "#5e2c91",
        status: "MUTED",
      },
    ],
  };
}
