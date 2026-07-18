import { getWorker } from "./workerManager.js";
import type { Router, MediaCodec } from "@repo/types";

let router: Router | undefined;

const routers = new Map<string, Router>();

export async function initRouterForRoom(roomId: string): Promise<Router> {
  if (routers.has(roomId)) {
    return routers.get(roomId)!;
  }

  const worker = getWorker();

  const mediaCodecs: MediaCodec[] = [
    {
      kind: "audio",
      mimeType: "audio/opus",
      clockRate: 48000,
      channels: 2,
    },
    {
      kind: "video",
      mimeType: "video/H264",
      clockRate: 90000,
      parameters: {
        "packetization-mode": 1,
        "profile-level-id": "42e01f",
        "level-asymmetry-allowed": 1,
      },
    },
  ];

  router = await worker.createRouter({ mediaCodecs });

  routers.set(roomId, router);

  return router;
}

export const getRouter = (roomId: string): Router => {
  const router = routers.get(roomId);
  if (!router) {
    throw new Error("Router isnt initialised");
  }
  return router;
};

export const getRouterCapabilities = (roomId: string) => {
  const router = getRouter(roomId);
  if (!router) {
    throw new Error("Router isnt initialised");
  }

  return router.rtpCapabilities;
};
