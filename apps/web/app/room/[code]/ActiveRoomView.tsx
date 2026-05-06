"use client";

import { useState } from "react";
import type { Room } from "@repo/types";
import { RoomHeader } from "../../../components/room/RoomHeader";
import { ParticipantList } from "../../../components/room/ParticipantList";
import { RoomControls } from "../../../components/room/RoomControls";
import { RoomTimer } from "../../../components/room/RoomTimer";

interface ActiveRoomViewProps {
  room: Room;
}

export const ActiveRoomView = ({ room }: ActiveRoomViewProps) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(true);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main content */}
      <main className="grow px-6 pt-12 pb-28 max-w-screen-xl mx-auto w-full">
        <RoomHeader
          participantCount={room.participants.length}
          roomName={room.name}
        />
        <ParticipantList participants={room.participants} />
        <RoomTimer closesInMinutes={room.closesInMinutes} />
      </main>

      {/* Bottom controls */}
      <RoomControls
        isMuted={isMuted}
        onToggleMute={() => setIsMuted((prev) => !prev)}
        isVideoOff={isVideoOff}
        onToggleVideo={() => setIsVideoOff((prev) => !prev)}
      />
    </div>
  );
};
