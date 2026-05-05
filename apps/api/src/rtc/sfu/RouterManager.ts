import { getWorker } from "./WorkerManager.js";
import type { Router, MediaCodec } from "@repo/types";

let router: Router | undefined;
export async function initRouter(): Promise<Router> {
  if (router) return router;

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

  return router;
}

export const getRouter = (): Router => {
  if (!router) {
    throw new Error("Router isnt initialised");
  }
  return router;
};
