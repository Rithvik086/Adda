import { getRouter } from "./RouterManager.js";
import type { Transport, DtlsParameters } from "@repo/types";

const transports = new Map<String, Transport>();

export const createWebRtcTransport = async (userId: String) => {
  const router = getRouter();
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
  transports.set(userId, transport);
  return {
    id: transport.id,
    iceParameters: transport.iceParameters,
    iceCandidates: transport.iceCandidates,
    dtlsParameters: transport.dtlsParameters,
  };
};

export const connectTransport = async (
  userId: String,
  dtlsParameters: DtlsParameters,
) => {
  const transport = transports.get(userId);
  if (!transport) {
    throw new Error(`Transport not found for user ${userId}`);
  }
  await transport.connect({ dtlsParameters });
};
