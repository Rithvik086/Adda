import { getRouter } from "./routerManager.js";
import type { Transport, DtlsParameters } from "@repo/types";

const transports = new Map<string, Map<string, Transport>>();

export const getTransport = (userId: string, roomId: string) => {
  const roomTransports = transports.get(roomId);
  if (!roomTransports) {
    throw new Error(`No transports found for room ${roomId}`);
  }

  const transport = roomTransports.get(userId);
  if (!transport) {
    throw new Error(`Transport not found for user ${userId} in room ${roomId}`);
  }

  return transport;
};

export const createWebRtcTransport = async (userId: string, roomId: string) => {
  const router = getRouter(roomId);
  const transport = await router.createWebRtcTransport({
    listenIps: [
      {
        // listen to all extrenally
        ip: "0.0.0.0",
        // set up t he servers ip address
        announcedIp: undefined,
      },
    ],
    enableUdp: true,
    enableTcp: true,
    preferUdp: true,
  });
  // storing the transport in the map
  if (!transports.has(roomId)) {
    transports.set(roomId, new Map());
  }
  transports.get(roomId)!.set(userId, transport);
  return {
    id: transport.id,
    iceParameters: transport.iceParameters,
    iceCandidates: transport.iceCandidates,
    dtlsParameters: transport.dtlsParameters,
  };
};

export const connectTransport = async (
  userId: string,
  roomId: string,
  dtlsParameters: DtlsParameters,
) => {
  const transport = getTransport(userId, roomId);
  await transport.connect({ dtlsParameters });
};
