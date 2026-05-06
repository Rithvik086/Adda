import { WorkerType } from "@repo/types";
import mediasoup from "mediasoup";
let worker: WorkerType;

export const initWorker = async () => {
  // for ensuring sigleton init
  if (worker) {
    return worker;
  }
  worker = await mediasoup.createWorker({
    logLevel: "warn",

    // for development purpose only
    rtcMaxPort: 49999,
    rtcMinPort: 40000,
  });

  //  worker crash
  worker.on("died", () => {
    console.error("Worker died");

    setTimeout(() => {
      process.exit(1);
    }, 3000);
  });

  return worker;
};

export const getWorker = () => {
  if (!worker) {
    throw new Error("Worker not initialized");
  }
  return worker;
};
