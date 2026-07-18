"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  isConnecting: false,
  error: null,
});

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;

  useEffect(() => {
    if (!socketUrl) {
      console.warn(
        "NEXT_PUBLIC_SOCKET_URL is not set. Socket.IO client is idle.",
      );
      return;
    }

    setIsConnecting(true);
    setError(null);

    // Init socket
    const socketInstance = io(socketUrl, {
      transports: ["websocket"],
      autoConnect: true,
    });

    setSocket(socketInstance);

    function onConnect() {
      setIsConnected(true);
      setIsConnecting(false);
      setError(null);
    }

    function onDisconnect(reason: Socket.DisconnectReason) {
      setIsConnected(false);
      setIsConnecting(false);

      if (reason === "io server disconnect") {
        socketInstance.connect();
      }
    }

    function onConnectError(err: Error) {
      setIsConnecting(false);
      setIsConnected(false);
      setError(err.message || "Failed to connect to the Socket server");
      console.error("Socket connection err:", err);
    }

    socketInstance.on("connect", onConnect);
    socketInstance.on("disconnect", onDisconnect);
    socketInstance.on("connect_error", onConnectError);

    return () => {
      socketInstance.off("connect", onConnect);
      socketInstance.off("disconnect", onDisconnect);
      socketInstance.off("connect_error", onConnectError);
      socketInstance.disconnect();
    };
  }, [socketUrl]);

  const value: SocketContextType = {
    socket,
    isConnected,
    isConnecting,
    error,
  };

  return <SocketContext value={value}>{children}</SocketContext>;
}

export const useSocket = (): SocketContextType => useContext(SocketContext);
