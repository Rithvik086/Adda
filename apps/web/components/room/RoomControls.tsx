"use client";

import { useRouter } from "next/navigation";

interface RoomControlsProps {
  isMuted: boolean;
  onToggleMute: () => void;
  isVideoOff: boolean;
  onToggleVideo: () => void;
}

export const RoomControls = ({
  isMuted,
  onToggleMute,
  isVideoOff,
  onToggleVideo,
}: RoomControlsProps) => {
  const router = useRouter();

  const handleLeave = () => {
    router.push("/");
  };

  return (
    <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-center">
      <div className="flex items-center gap-3">
        {/* Mic toggle */}
        <button
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-95 ${
            isMuted
              ? "bg-surface-container-highest text-outline"
              : "bg-primary text-on-primary"
          }`}
          onClick={onToggleMute}
          title={isMuted ? "Unmute" : "Mute"}
        >
          <span className="material-symbols-outlined text-xl">
            {isMuted ? "mic_off" : "mic"}
          </span>
        </button>

        {/* Video toggle */}
        <button
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-95 ${
            isVideoOff
              ? "bg-surface-container-highest text-outline"
              : "bg-primary text-on-primary"
          }`}
          onClick={onToggleVideo}
          title={isVideoOff ? "Turn on camera" : "Turn off camera"}
        >
          <span className="material-symbols-outlined text-xl">
            {isVideoOff ? "videocam_off" : "videocam"}
          </span>
        </button>

        {/* Leave room */}
        <button
          className="h-12 px-6 rounded-full border border-outline-variant/40 text-primary font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-surface-container-high transition-all active:scale-95"
          onClick={handleLeave}
          title="Leave room"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
          Leave
        </button>
      </div>
    </div>
  );
};
