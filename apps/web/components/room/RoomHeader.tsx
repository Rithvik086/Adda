"use client";

interface RoomHeaderProps {
  roomName: string;
  participantCount: number;
}

export const RoomHeader = ({
  roomName,
  participantCount,
}: RoomHeaderProps) => {
  return (
    <div className="mb-10 max-w-lg mx-auto w-full">
      <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2">
        {roomName}
      </h1>
      <p className="text-sm text-on-surface-variant font-medium">
        {participantCount} {participantCount === 1 ? "participant" : "participants"} currently connected
      </p>
    </div>
  );
};
