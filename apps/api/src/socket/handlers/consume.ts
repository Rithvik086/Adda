import { Server, Socket } from "socket.io";
import {
  consume,
  getTransport,
  getConsumableProducers,
  resumeConsumer,
} from "../../rtc/sfu/index.js";
import { getPeerBySocket } from "../../services/redis.js";

export const handleConsume = (io: Server, socket: Socket) => {
  socket.on("consume", async ({ roomId, rtpCapabilities, producerId }, cb) => {
    try {
      const userId = await getPeerBySocket(socket.id);
      if (!userId) {
        throw new Error("No userId associated with socket id");
      }
      const transport = getTransport(userId, roomId, "s2c");
      const producers = getConsumableProducers(roomId, userId);
      const targetProducer = producers.find(
        (p) => p && p.producer.id === producerId,
      );
      if (!targetProducer) {
        throw new Error("Producer not found or not allowed");
      }
      const consumerParams = await consume(
        userId,
        roomId,
        transport,
        producerId,
        rtpCapabilities,
      );
      cb({ data: consumerParams });
    } catch (err) {
      cb({ error: err instanceof Error ? err.message : "error consuming" });
    }
  });

  socket.on("resumeConsumer", async ({ consumerId }, cb) => {
    try {
      await resumeConsumer(consumerId);
      if (typeof cb === "function") {
        cb({ success: true });
      }
    } catch (err) {
      if (typeof cb === "function") {
        cb({ error: err instanceof Error ? err.message : "Failed to resume consumer" });
      }
    }
  });
};

// TODO: Need to create a handleConsumeDisconnect
