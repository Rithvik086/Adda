"use client";

import { useSocket } from "../../lib/socket";

export function SocketClient() {
  const { isConnecting, isConnected, socket, error } = useSocket();
  const socketId = socket?.id;

  return (
    <div className="text-xs text-neutral-500">
      <div>
        {isConnecting ? (
          " Connecting..."
        ) : (
          <>
            Socket: {isConnected ? "Connected" : "Disconnected"}
            {socketId ? ` (${socketId})` : null}
          </>
        )}

        <div>{error ? <div>Error: {error}</div> : <></>}</div>
      </div>
    </div>
  );
}
